// Libraries

const dotenv = require('dotenv');
const { Client, Intents } = require("discord.js");
const { executeSearch } = require('./command/search');
const { SEARCH_COMMAND } = require('./utils/constants');

// Configuration
dotenv.config();

// Declaration
const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

// When the client is ready, run this code (only once)
client.once("ready", async () => {
	console.log("Ready!");
});

client.once("reconnecting", () => {
	console.log("Reconnecting!");
});
client.once("disconnect", () => {
	console.log("Disconnect!");
});

// Login to Discord with your client's token
client.login(token);

client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		handleCommand(interaction);
	}
});

const handleCommand = async (interaction) => {
	const { commandName, options } = interaction;

	switch (commandName) {
		case "ping":
			interaction.reply({
				content: "PONG!",
				ephemeral: true
			});
			break;
		case "add":
			const firstNumber = options.getNumber("number1") || 0;
			const secondNumber = options.getNumber("number2") || 0;
			res = firstNumber + secondNumber;

			interaction.reply({
				content: res.toString(),
				ephemeral: true
			});

			break;
		case SEARCH_COMMAND:
			lastCommand.set(interaction.guildId, interaction.userId, {
				command: SEARCH_COMMAND,
				results: await executeSearch(interaction)
			});
		default:
			break;
	}
}