const rp = require('request-promise');

exports.admin = true;
exports.help = "Get the latest news on Steam.";
exports.run = async (bot, client, message, args, content) =>
{
	try
	{
		var searchName = content.toLowerCase();

		//console.log("searching for " + searchName);

		var newsUrl  = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?count=1&appid=' + bot.config.steam_appid;
		var newsJson = await rp(newsUrl);
        var news     = JSON.parse(newsJson);

		if (news.appnews.newsitems.length == 0)
		{
			return message.channel.send(`${message.author} there was no news`);
		}
		
		var newsItem = news.appnews.newsitems[0];
		var content = newsItem.contents;

		// perform VERY basic conversion from bbcode to markdown
		content = content.replace(/\[img\]/g, "");
		content = content.replace(/\[\/img\]/g, "");

		content = content.replace(/\[b\]/g, "**");
		content = content.replace(/\[\/b\]/g, "**");

		content = content.replace(/\[i\]/g, "*");
		content = content.replace(/\[\/i\]/g, "*");

		content = content.replace(/\[u\]/g, "__");
		content = content.replace(/\[\/u\]/g, "__");

		content = content.replace(/\[s\]/g, "~~");
		content = content.replace(/\[\/s\]/g, "~~");

		content = content.replace(/\[code\]/g, "`");
		content = content.replace(/\[\/code\]/g, "`");

		content = content.replace(/\[list\]/g, "");
		content = content.replace(/\[\/list\]/g, "");

		content = content.replace(/\[\*\]/g, "* ");
				
		message.channel.send({embeds: [{
			color: 0xFFFFFF,
			title: newsItem.title,
			url: newsItem.url,
			description: content.substr(0,2000) // clip string to max limit supported by discord
		}]});
					
	} catch (e) {
		console.error(e);
	}
}