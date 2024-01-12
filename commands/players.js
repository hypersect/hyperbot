const rp = require('request-promise');

exports.admin = false;
exports.help = "Get the number of in game players.";
exports.run = async (bot, client, message, args, content) =>
{
	try
	{
	    message.delete();

		var searchName = content.toLowerCase();

		//console.log("searching for " + searchName);

		var playersUrl  = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' + bot.config.steam_appid;
		var playersJson = await rp(playersUrl);
        var players     = JSON.parse(playersJson);

		var playerCount = players.response.player_count;
		

		message.channel.send(`${message.author} the current number of players in game on Steam is ${playerCount}.`); 
	} catch (e) {
		console.error(e);
	}
}