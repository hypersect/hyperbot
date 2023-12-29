const Discord = require("discord.js");
const client = new Discord.Client({ intents: [
	Discord.GatewayIntentBits.Guilds,
	Discord.GatewayIntentBits.GuildMessages,
	Discord.GatewayIntentBits.MessageContent,
]});
const rp = require('request-promise');
const xml2js = require('xml2js-es6-promise');
const fs = require("fs");
const Enmap = require('enmap');
const steam = require('./utility/steam');

//===
// Create the global bot object
const bot = new Object();

// Load the data driven configuration files.
bot.config = require("./config.json");
bot.secret = require("./secret.json");

// Create persistant databases used by commands.
// TODO: drive this by the commands
// note: the EnmapLevel name corresponds to the file name in the "data" folder
bot.steamIds   = new Enmap({ name: 'database_SteamIds' });   // steam id registrations per user
bot.tournament = new Enmap({ name: 'database_Tournament' }); // active tournament data

// Create list of cached high score values
// todo: make this persist on disk such that we still report high scores created
//       during a period where the bot is not running.
bot.highScores = new Map();

// Create mapping from command names to command files
bot.commands = new Map();

//===
// Read all commands from the "commands" folder and insert into the command map
fs.readdir("./commands/", (err, files) =>
{
    if (err) return console.error(err);
    files.forEach(file => {
        let commandFunction = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        bot.commands.set(commandName, commandFunction);
    });
});

//*****************************************************************************
//*****************************************************************************
bot.MemberCanUseCommand = function (member, command)
{
	if (command.admin)
	{
		if (!member.permissions.has(Discord.PermissionFlagsBits.Administrator))
			return false;
	}
	
	if (command.role)
	{
		if(!member.roles.cache.some(r => r.name === this.config.roles[command.role]))
			return false;
	}
	
	return true;
}

//*****************************************************************************
// Evaluate the current leaderboard high scores and report any changes to the
// top ranked scores.
//*****************************************************************************
async function CompareHighScores(client)
{
    console.log("Checking high scores");

    // load list of leaderboards	
	var leaderboardList = await steam.GetLeaderboardList(bot.config.steam_appid);

    // put leaderboard scores into map and check for changes
    var highScores = new Map();
    var leaderboardCount = leaderboardList.leaderboard.length;
    for (var leaderboardIdx = 0; leaderboardIdx < leaderboardCount; ++leaderboardIdx)
    {
        var curLeaderboard = leaderboardList.leaderboard[leaderboardIdx];

        var leaderboardXml = await rp(curLeaderboard.url + '&start=1&end=1');
		if (!leaderboardXml)
		{
			console.log("Failed to get leaderboard xml for " + curLeaderboard.display_name);
			continue;
		}
		
        var leaderboard = await xml2js(leaderboardXml, {explicitArray : false, async: false})
		if (!leaderboard || !leaderboard.response || !leaderboard.response.entries || !leaderboard.response.entries.entry)
		{
			console.log("Unexpected leaderboard js for " + curLeaderboard.display_name);
			continue;
		}

        var newEntry = leaderboard.response.entries.entry;
	    if (newEntry)
        {
            var newScore = newEntry.score;
            var oldScore = bot.highScores.get(curLeaderboard.lbid);
            var messageNewScore = false;

            if (oldScore != undefined)
            {
                if (oldScore != newScore) // note that we dont test greater than to make this agnostic to sort mode
                {
                    console.log("New high score of " + newScore + " for leaderboard " + curLeaderboard.display_name);
                    bot.highScores.set(curLeaderboard.lbid, newScore);
					
					if (!bot.config.steam_leaderboard_tracking_blacklist.includes(curLeaderboard.lbid))
					{
						messageNewScore = true;
					}
                }
            }
            else
            {
                //console.log("Tracking initial high score of " + newScore + " for leaderboard " + curLeaderboard.display_name);
                bot.highScores.set(curLeaderboard.lbid, newScore);
            }

            if (messageNewScore)
            {
                var channel = client.channels.get(bot.config.steam_channel);
                if (channel)
                {
                    // query info about new high score hoder
                    var usersUrl  = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=' + bot.secret.steam_api_key + '&format=json&steamids=' + newEntry.steamid;
                    var usersJson = await rp(usersUrl);
                    var users     = JSON.parse(usersJson);
				
                    // process the data
                    var nameData = "";
                    var iconUrl = "";

                    var player = users.response.players.find(x => x.steamid == newEntry.steamid);
                    if (player)
                    {
                        nameData = player.personaname;;
                        iconUrl = player.avatar;
                    }
                    else
                    {
                        // unexpected failure to find steamid in results
                        nameData += newEntry.steamid + "\n";
                    }

                    // shore the results
                    channel.send({embed: {
                        color: 0xFFFFFF,
                        title: curLeaderboard.display_name,
                        url: "http://steamcommunity.com/stats/" + bot.config.steam_appid + "/leaderboards/" + curLeaderboard.lbid + "/",
                        description: "New high score of " + parseInt(newScore).toLocaleString() + " by " + nameData + "!",
                        thumbnail: { url: iconUrl },
                    }});
                }
            }
        }
    }
}

//*****************************************************************************
// The bot has been started
//*****************************************************************************
client.on("ready", () =>
{
    console.log("HYPERBOT is ready!");
	
	// CompareHighScores function with a null this pointer and the client parameter.
	// This allows the bound result to be called without specifying a parameter.	
    var BoundComputeHighScores = CompareHighScores.bind(null, client);
	
	// Immediately initialize high score data
    BoundComputeHighScores();
	
	// Periodically reevaluate high score data
	var hoursPerInterval = parseInt(bot.config.hours_per_highscore_evaluation);
	if (hoursPerInterval > 0)
	{
		var msPerHour = 60 * 60 * 1000;
		setInterval(BoundComputeHighScores, bot.config.hours_per_highscore_evaluation * msPerHour);
	}
	else
	{
		console.error("Invalid highscore evaluation interval was specified.");
	}
});

//*****************************************************************************
// The bot has read a new message
//*****************************************************************************
client.on("messageCreate", async (message) =>
{
	// ignore messages from other bots (cheap way to prevent accidental feedback loops)
    if (message.author.bot)
		return;
	
	// ignore messages that dont start with the command prefix (e.g. "!")
    if (!message.content.startsWith(bot.config.prefix)) 
		return;

	// trim the command prefix from the message and remove whitespace from ends
	var content = message.content.slice(bot.config.prefix.length).trim();
    
	// split message into arguments according to white space
	// todo: support arguments containing white space by using quotes
    var args = content.split(/\s+/g);
	
	// pop the command name off the front of the argument list and strip it from the message content
    var commandName = args.shift().toLowerCase();
    content = content.substring(commandName.length).trim();
  
    //  search for a matching command
	var command = bot.commands.get(commandName);
	if (command)
	{
		// check if this member can run this command
		if(!bot.MemberCanUseCommand(message.member, command))
		{
			message.channel.send(`${message.author} You do not have permission to use this command.`);
		}		
		else
		{
			// execute the registered command
			try
			{
				await command.run(bot, client, message, args, content);
			}
			catch (err)
			{
				message.channel.send(`${message.author} There was an unexpected error.`);
				console.error(err);
			}
		}
	}
	else
	{
		console.warn("Unknown command: '" + commandName + "'");
	}
});

client.login(bot.secret.token);