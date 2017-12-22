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
		message.reply("the active tournament can be viewed at: " + active);
	}
	else
	{
		message.reply("there is no active tournament.");
	}
}
