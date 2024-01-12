const Discord = require("discord.js");
const rp = require('request-promise');
const xml2js = require('xml2js-es6-promise');

exports.admin = false;
exports.help = "Unregister your Steam user from your Discord user.";
exports.run = async (bot, client, message, args, content) =>
{
    // wait for data to load
    await bot.steamIds.defer;
		
	var steamId   = null;
	var discordId = null;
	
	var isAdmin = message.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR);
	if (isAdmin)
	{
		// validate that the url is in the appropriate form
		if (args.length != 1 ||
			(!args[0].startsWith("http://steamcommunity.com/profiles/") &&
			 !args[0].startsWith("https://steamcommunity.com/profiles/") &&
			 !args[0].startsWith("http://steamcommunity.com/id/") &&
			 !args[0].startsWith("https://steamcommunity.com/id/")))
		{
			return message.channel.send(`${message.author} as an administrator, you must specify a full Steam profile URL after the command (including the http).`);
		}
		else
		{
			var userUrl  = args[0] + "?xml=1";
			var userXml  = await rp(userUrl);
			var user     = await xml2js(userXml, {explicitArray : false, async: false});

			var steamId   = user.profile.steamID64;
			var steamName = user.profile.steamID;
			
			discordId = bot.steamIds.get("steamId:" + steamId);
			steamId   = bot.steamIds.get("discordId:" + discordId);
		}
	}	
	else
	{
		discordId = message.author.id;
		steamId   = bot.steamIds.get("discordId:" + discordId);
    }
	
	if (steamId)
		bot.steamIds.delete("steamId:" + steamId);
	
	if (discordId)
		bot.steamIds.delete("discordId:" + discordId);

    message.channel.send(`${message.author} unregistered all associated accounts`);
}
