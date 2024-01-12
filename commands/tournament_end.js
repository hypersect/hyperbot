//*****************************************************************************
// This is an example command documenting how everything works.
//*****************************************************************************

exports.role = "tournament_admin";
exports.help = "End the current tournament.";
exports.run = async (bot, client, message, args, content) =>
{
	// validate that the url is in the appropriate form
	if (args.length != 1 || message.mentions.members.size != 1)
	{
        return message.channel.send(`${message.author} please specify a member that won the tournament.`);
    }

	var tournamentChannel = client.channels.cache.get(bot.config.tournament_channel);
	if (tournamentChannel)
	{
		var winnerMember = message.mentions.members.first();
		var winnerRole = message.guild.roles.cache.find(r => r.name ===  bot.config.roles["tournament_winner"]);
		
		// unpin the old tournament message
		var messageId = bot.tournament.get("message");
		if (messageId)
		{
			try
			{
				var pinnedMessage = await tournamentChannel.messages.fetch(messageId);
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
		
		// remove winner role from all members
		winnerRole.members.each(member => {
			if (member.id != winnerMember.id)
			{
				member.roles.remove(winnerRole);
			}
		});
		
		// add winner role to the winner
		winnerMember.roles.add(winnerRole);

		var activeTournament = args[0];
		bot.tournament.set("active", undefined);
		bot.tournament.set("winner", winnerMember.id);
		tournamentChannel.send("The tournament is finished and " + winnerMember.toString() + " is the new " + winnerRole.toString()+ "!");
	}
}