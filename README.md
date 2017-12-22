# Hyperbot

Hyperbot is a Discord bot developed for the [INVERSUS](http://www.inversusgame.com) Discord server which you can find at [discord.gg/inversus](http://www.discord.gg/inversus).

## Features
* **Steam**
 	* Automated notifications when new leaderboard high scores are acheived.
 	* Ask for top scores by leaderboard name.
 	* Ask for a list of all leaderboards.
 	* Ask for active player count.
 	* Register/unregister your Steam profile with your Discord. This allows for the following commands:
 		* Post a Steam invitation link to your in-game lobby. This requires your Steam lobbies to be properly integrated for Steam invitations (i.e. the Join Game button on user profiles works).
 	* Request the latest Steam community news item text be posted (currently admin only)
* **Challonge**
	* Tournament moderators can register an active tournament.
	* Tournament moderators can assign a winner on tournament completion. The latest winner is awarded a special Discord role.
	* Ask for a link to the active tournament bracket
* **General** 
	* Users to subscribe/unsubscribe from a specific set of roles.
	* Request a list of all commands.
	* Administrators can reload command files without restarting the bot.

## Implementation

I am by no means an expert JavaScript nor node.js programmer so I don't claim for this to be the best architecture or implementation, but it should be fairly easy to extend and work within.

### Commands
Adding new commands is just a matter of adding new my_command_name.js files to the commands folder. See the test.js command file for a simple example with documentation.

### Configuration
Integrating with your server is performed by editing two json files in the root folder.

#### secret.json
This file contains all of the data you do not want to accidentally check into a public repository or share on a dev stream. It contains the following information:
* **token** - This is your Discord bot's token that allows use of the Discord API. It is required for the bot to function.
* **steam_api_key** - This is your key that allows access to the Steam Web API. It is only required for Steam related commands.

#### config.json
This file contains all of the non-secrect configuration data that helps integrate the bot commands with the specifics of your server.
* **prefix** - This defines the string that goes before a command name (e.g. "!" or "/") that causes the bot to pay attention.
* **steam_appid** - This is the Steam app id number of the game you want Steam related commands to operate on.
* **steam_channel** - Discord ID number for the channel you want Steam related information posted to.
* **steam_leaderboard_tracking_blacklist** - This allows for specific leaderboards to be ignored for any automated score reporting. 
* **house_per_highscore_evaluation** - Set how often the bot should query and report new highscrores from the Steam Web API.
* **tournament_channel** - Discord ID number for the channel you want tournament related information posted to.
* **roles** - Map role names referenced by commands to actual Discord role names from your server. The following roles are currently supported:
	* **tournament_admin** - This is the role for users that can begin and end tournaments.
	* **tournament_winner** - This is the role assigned to the winner of the most recent tournament.
* **subscriptions** - This is a list of Discord roles that users can freely assign/unassign to/from themselves.


