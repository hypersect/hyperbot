//*****************************************************************************
// This is an example command documenting how everything works.
//*****************************************************************************

exports.help = "Unsubscribe from a Discord role to stop being notified when it is mentioned.";
exports.run = (bot, client, message, args, content) => {
	message.delete();

	if (content && content.length > 0)
	{
		var contentUpperCase = content.toUpperCase();
		var subscriptionIndex = bot.config.subscriptions.findIndex(subscription => { return subscription.toUpperCase() == contentUpperCase; });
		if (subscriptionIndex >= 0)
		{
			var roleName = bot.config.subscriptions[subscriptionIndex];
			var role = message.guild.roles.find("name", roleName);
			if (role)
			{
				message.channel.send('Unsubscribing ' + message.member.toString() + ' from role "' + roleName + '".');
				message.member.removeRole(role);
			}
			else
			{
				message.channel.send(`${message.author} there was an unexpected error. Does role "${roleName}" not exist on the server?`);
			}
		}
		else
		{
			var subscriptions = "";
			bot.config.subscriptions.forEach(subscription => { subscriptions += "    " + subscription + "\n"; });

			message.channel.send(`${message.author} "${content}" is not a valid role. Please choose from:\n${subscriptions}`);
		}
	}
	else
	{
		console.dir(bot.config);

		var subscriptions = "";
		bot.config.subscriptions.forEach(subscription => { subscriptions += "    " + subscription + "\n"; });

		message.channel.send(`please specify a role to unsubscribe from:\n${subscriptions}`);
	}
}