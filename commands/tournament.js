//*****************************************************************************
// This is an example command documenting how everything works.
//*****************************************************************************

exports.help = "Get information about the active tournament.";
exports.run = (bot, client, message, args, content) =>
{
	message.delete();
	
	var active = bot.tournament.get("active");
	if (active)
	{
		message.channel.send(`${message.author} the active tournament can be viewed at: ${active}`);
	}
	else
	{
		message.channel.send(`${message.author} there is no active tournament.`);
	}
}
