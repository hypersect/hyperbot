const rp = require('request-promise');
const xml2js = require('xml2js-es6-promise');

exports.admin = false;
exports.help = "Register your Steam user to your Discord user.";
exports.run = async (bot, client, message, args, content) =>
{
    // validate that the url is in the appropriate form
	if (args.length != 1 ||
		(!args[0].startsWith("http://steamcommunity.com/profiles/") &&
         !args[0].startsWith("https://steamcommunity.com/profiles/") &&
         !args[0].startsWith("http://steamcommunity.com/id/") &&
         !args[0].startsWith("https://steamcommunity.com/id/")))
	{
        return message.reply("please specify a full Steam profile URL after the command (including the http).");
    }

    // load information about the steam user
    try
    {
        var userUrl  = args[0] + "?xml=1";
        var userXml  = await rp(userUrl);
        var user     = await xml2js(userXml, {explicitArray : false, async: false});

        var steamId   = user.profile.steamID64;
        var steamName = user.profile.steamID;

        // wait for data to load
        await bot.steamIds.defer;

        // validate that this steam id is not already in use
        var discordId = bot.steamIds.get("steamId:" + steamId);
        if (discordId)
        {
            console.log("Found registered discord id " + discordId);
            var discordUser = client.users.get(discordId);
            if (discordUser)
            {
                return message.reply("steam user " + steamName + " is already registered to user " + discordUser.toString() + ". Please ask an administrator to unregister the SteamID.");
            }
        }

        // clean up any old registrations
        if (discordId)
        {
            bot.steamIds.delete("steamId:" + steamId);
            bot.steamIds.delete("discordId:" + discordId);
        }

        // register the steam id
        bot.steamIds.set("steamId:" + steamId, message.author.id);
        bot.steamIds.set("discordId:" + message.author.id, steamId);

        message.delete();
        message.channel.send("Registering Steam user " + steamName + " to Discord user <@" + message.author.id + ">");
    }
    catch (e)
    {
        message.reply("Failed to register Steam user.");
        console.error(e);
    }
}