exports.admin = false;
exports.help = "Get hyped!";
exports.run = (bot, client, message, args, content) =>
{
	// randomize the hype message suffix
	var hypeText = (Math.random() < 0.1) ? "HYYYYYPE" : "HYPE";
	hypeText += (Math.random() < 0.3) ? "!!" : "!";
	hypeText += (Math.random() < 0.3) ? "!" : "";
	
    if (content && content.length > 0)
        message.channel.send(content.toUpperCase() + " " + hypeText).catch(console.error);
    else
        message.channel.send(hypeText).catch(console.error);
}