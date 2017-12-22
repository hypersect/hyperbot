//*****************************************************************************
// This file contains utility functions for interfacing with the Steam API
//*****************************************************************************
const rp = require('request-promise');
const xml2js = require('xml2js-es6-promise');

//*****************************************************************************
// Return the response structure from the GetPlayerSummaries API.
//*****************************************************************************
exports.GetPlayerSummaries = async (
	steam_api_key,	// key for accessing Steam API
	steam_ids       // array of steam user ids to query
) =>
{
	// build url to query user data
	var usersUrl = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/';
	usersUrl += '?key=' + steam_api_key + '&format=json&steamids=';
	for (var i = 0; i < steam_ids.length; ++i)
	{
		usersUrl += steam_ids[i];
		if (i < steam_ids.length)
			usersUrl += ',';
	}
	
    // query info about new high score hoder
    var usersJson = await rp(usersUrl);
    var users     = JSON.parse(usersJson);
				
    return users.response;
}

//*****************************************************************************
// Return the response structure from the leaderboards API.
//*****************************************************************************
exports.GetLeaderboardList = async (
	steam_appid	// id of the steam application
) =>
{
	var leaderboardListUrl = 'http://steamcommunity.com/stats/' + steam_appid + '/leaderboards/';
	var leaderboardListXml = await rp(leaderboardListUrl + '?xml=1');
	var leaderboardList    = await xml2js(leaderboardListXml, {explicitArray : false, async: false})

	return leaderboardList.response;
}
