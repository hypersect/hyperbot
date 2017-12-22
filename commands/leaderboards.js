const rp = require('request-promise');
const xml2js = require('xml2js-es6-promise');
const steam = require('../utility/steam');

exports.admin = false;
exports.help = "List all leaderboards.";
exports.run = async (bot, client, message, args) =>
{
	var leaderboardList = await steam.GetLeaderboardList(bot.config.steam_appid);

	var response = "";	
	var leaderboardCount = leaderboardList.leaderboard.length;
	for (var i = 0; i < leaderboardCount; ++i)
	{
		var curLeaderboard = leaderboardList.leaderboard[i];
		response += curLeaderboard.display_name + ": http://steamcommunity.com/stats/" + bot.config.steam_appid + "/leaderboards/" + curLeaderboard.lbid + "\n";
	}

	message.channel.send(response);
}