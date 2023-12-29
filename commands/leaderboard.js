const rp = require('request-promise');
const xml2js = require('xml2js-es6-promise');
const levenshtein = require('fast-levenshtein');
const steam = require('../utility/steam');

exports.admin = false;
exports.help = "List scores from a given leaderboard.";
exports.run = async (bot, client, message, args, content) =>
{
	message.delete();

	if (content.length == 0)
		return message.channel.send(`${message.author} Specify a leaderboard name.`)

	var searchName = content.toLowerCase();

	//console.log("searching for " + searchName);

	var leaderboardList = await steam.GetLeaderboardList(bot.config.steam_appid);

	// find closest name match for a leaderboard
	var leaderboardCount = leaderboardList.leaderboard.length;
	var leaderboardListEntry = null;
	var bestDistance = 0;
	for (var i = 0; i < leaderboardCount; ++i)
	{
		var curLeaderboard = leaderboardList.leaderboard[i];

		var compareName = curLeaderboard.display_name.toLowerCase();

		var curDistance = levenshtein.get(searchName, compareName);

		//console.log("distance to " + compareName + " is " + curDistance);

		if (!leaderboardListEntry || curDistance < bestDistance)
		{
			bestDistance = curDistance;
			leaderboardListEntry = curLeaderboard;
		}
	}

	if (!leaderboardListEntry)
		return message.channel.send(`${message.author} Did not find leaderboard ${searchName}`)
			
	var leaderboardXml = await rp(leaderboardListEntry.url + '&start=1&end=10');
				
	var leaderboard = await xml2js(leaderboardXml, {explicitArray : false, async: false})
	var entries = leaderboard.response.entries;
				
	// request information on all the players
	var playerIds = new Array();
	for (var i = 0; i < entries.entry.length; ++i)
		playerIds[i] =  entries.entry[i].steamid;
	var playerResponse = await steam.GetPlayerSummaries(bot.secret.steam_api_key, playerIds);

	// process the data
	var nameData = "";
	var scoreData = "";
	var iconUrl = "";
	for (var i = 0; i < entries.entry.length; ++i)
	{
		var entry = entries.entry[i];
		var player = playerResponse.players.find(x => x.steamid == entry.steamid);
		if (player)
		{
			nameData += "[" + player.personaname + "](" + player.profileurl + ")\n";

			// show icon of top ranked player
			if (i == 0) iconUrl = player.avatar;
		}
		else
		{
			// unexpected failure to find steamid in results
			nameData += entry.steamid + "\n";
		}

		scoreData += parseInt(entry.score).toLocaleString() + "\n";
	}
				
	// shore the results
	message.channel.send({embeds: [{
		color: 0xFFFFFF,
		title: leaderboardListEntry.display_name,
		url: "http://steamcommunity.com/stats/" + bot.config.steam_appid + "/leaderboards/" + leaderboardListEntry.lbid + "/",
		//thumbnail: { url: iconUrl },
		footer: {
			text: "Leaderboard '" + content + "' requested by " + message.author.username + ".",
			icon_url: message.author.displayAvatarURL
		},
		fields: [{
			name: "Name",
			value: nameData,
			inline: true
		},
			{
			name: "Score",
			value: scoreData,
			inline: true
			}
		],
	}]});
}