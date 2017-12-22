exports.admin = false;
exports.help = "Information about this bot.";
exports.run = (bot, client, message, args, content) =>
{
	message.channel.send({embed: {
		color: 0xFFFFFF,
		title: "Hyperbot",
		url: "https://github.com/hypersect/hyperbot/",
		description: "Hyperbot was originally developed by Hypersect for the INVERSUS Discord community.",
		fields: [{
			name: "Links",
			value: "[Hypersect](http://www.hypersect.com), [INVERSUS](http://www.inversusgame.com), [Hyperbot](https://github.com/hypersect/hyperbot/)",
			inline: true
		}]
	}});
}