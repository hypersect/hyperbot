const rp = require('request-promise');
const steam = require('../utility/steam');

exports.admin = false;
exports.help = "Post an invitation link to your private Steam lobby.";
exports.run = async (bot, client, message, args, content) =>
{
    // wait for data to load
    await bot.steamIds.defer;

	// get steam id from discord id
    var steamId = bot.steamIds.get("discordId:" + message.author.id);
    if (!steamId)
        return message.reply("please register your steam profile with the 'register' command before using the 'invite' command.");

	// load information for steam id
	var playerIds = [ steamId ];
	var response  = await steam.GetPlayerSummaries(bot.secret.steam_api_key, playerIds);
    var player    = response.players.find(x => x.steamid == steamId);
	
    if (player && player.lobbysteamid)
    {
        message.delete();
        message.channel.send("Join <@" + message.author.id + ">'s game at steam://joinlobby/" + bot.config.steam_appid + "/" + player.lobbysteamid + "/" + steamId);
    }
    else
    {
        message.reply("Failed to find an open private lobby for others to join. Is your Steam profile private?");
    }
}