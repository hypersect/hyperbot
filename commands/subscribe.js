//*****************************************************************************
// This is an example command documenting how everything works.
//*****************************************************************************

exports.help = "Subscribe to a Discord role so that you can be notified when it is mentioned.";
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
				message.channel.send('Subscribing ' + message.member.toString() + ' to role "' + roleName + '".');
				message.member.addRole(role);
			}
			else
			{
				message.reply('there was an unexpected error. Does role "' + roleName + '" not exist on the server?');
			}
		}
		else
		{
			var subscriptions = "";
			bot.config.subscriptions.forEach(subscription => { subscriptions += "    " + subscription + "\n"; });

			message.reply('"' + content + '" is not a valid role. Please choose from:\n' + subscriptions);
		}
	}
	else
	{
		console.dir(bot.config);

		var subscriptions = "";
		bot.config.subscriptions.forEach(subscription => { subscriptions += "    " + subscription + "\n"; });

		message.reply("please specify a role to subscribe to:\n" + subscriptions);
	}
}