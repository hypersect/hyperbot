//*****************************************************************************
// This is an example command documenting how everything works.
//*****************************************************************************

// Set true for commands that only administrators can use
exports.admin = true;

// Restrict command usage to a Discord role.
//  Assign a role name from the config.json file. Note that this is not
//  the actual Discord role name. This abstraction allows for servers to
//  integrate their own roles with command scripts without actually needing
//  to edit the commmand scripts.
exports.role = null; //"my_role_name";

// Running the help command will print this description for this command
exports.help = "This is a test command.";

// This is the function that runs for the command
// Parameters:
//  bot:     Reference to the global bot state allowing coordination
//           between multiple commands.
//  client:  The Discord client object.
//  message: The Discord message object that triggered the command.
//  args:    Command input string delimited by whitespace into an array of command arguments
//  content: Command input string without being delimited.
exports.run = (bot, client, message, args, content) => {
	message.channel.send('The test command was run with an input of "' + content + '" which was split into ' + args.length + " arguments.");
}