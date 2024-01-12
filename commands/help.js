const Discord = require("discord.js");

exports.admin = false;
exports.help = "Describes how to use each command.";
exports.run = async (bot, client, message, args, content) =>
{
	var msgText = "These are the available commands:\n\n"
	
	bot.commands.forEach(
		function (item, key, mapObj)
		{
			if (bot.MemberCanUseCommand(message.member, item))
			{
				msgText += "**" + key.toString() + "**";
				if (item.admin)
					msgText += " *(admin)*";
				
				if (item.role)
					msgText += " *(role: " + bot.config.roles[item.role] + ")*";
					
				msgText += "\n" + item.help + "\n";
			}
		});  
    
	// delete the request message and post the response
	message.delete();
    message.channel.send(`${message.author} ${msgText}`); 
}