//*****************************************************************************
// This is an example command documenting how everything works.
//*****************************************************************************

exports.role = "tournament_admin";
exports.help = "Begin a new tournament.";
exports.run  = async (bot, client, message, args, content) =>
{
	// validate that the url is in the appropriate form
	if (args.length != 1 || !args[0].startsWith("http://challonge.com/"))
	{
        return message.reply("please specify a full Challonge tournament  URL after the command (including the http).");
    }

	var tournamentChannel = client.channels.get(bot.config.tournament_channel);
	if (tournamentChannel)
	{
		// unpin the old tournament message
		var messageId = bot.tournament.get("message");
		if (messageId)
		{
			try
			{
				var pinnedMessage = await tournamentChannel.fetchMessage(messageId);
				if (pinnedMessage)
				{
					pinnedMessage.unpin();
					bot.tournament.set("message", undefined);
				}
			}
			catch(err)
			{
				console.error(err);
			}
		}
	
		// set the new tournament and message
		{
			var activeTournament = args[0];
			bot.tournament.set("active", activeTournament);
			var replyMessage = await tournamentChannel.send("A new tournament has begun! You can view it at: " + activeTournament);
			bot.tournament.set("message", replyMessage.id);
			replyMessage.pin();
		}
	}
}
