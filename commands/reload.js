exports.admin = true;
exports.help = "Reloads the script for a given a command";
exports.run = async (bot, client, message, args, content) =>
{
   if(!args || args.length != 1)
		return message.channel.send(`${message.author} provide a command name to reload.`);

    var commandName = args[0];

	try
	{
		// unload the old command
		if (bot.commands.has(commandName))
		{
			// the path is relative to the *current folder*
			delete require.cache[require.resolve(`../commands/${commandName}.js`)];
		}

		// load in the new command
		bot.commands.set(commandName, require(`../commands/${commandName}.js`));
		message.delete();
		message.channel.send(`${message.author} the command ${commandName} has been reloaded`);
	}
	catch (err)
	{
		console.error(err);
	}
}
