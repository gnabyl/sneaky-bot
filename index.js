// Libraries

const dotenv = require('dotenv');
const { Client, Intents } = require("discord.js");
const { executeSearch } = require('./command/search');
const { SEARCH_COMMAND, PLAY_COMMAND } = require('./utils/constants');
const LastCommand = require("./utils/last-command");
const SongQueue = require('./utils/song-queue');
const { joinVoiceChannel } = require('@discordjs/voice');

// Configuration
dotenv.config();

// Declaration
const token = process.env.TOKEN;
const lastCommand = new LastCommand();
const serverQueue = new SongQueue();

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
		return;
	}
	if (interaction.isButton()) {
		handleButton(interaction);
		return;
	}
});

const handleCommand = async (interaction) => {
	const { commandName, options } = interaction;

	switch (commandName) {
		// Normal command
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
		// All the music commands
		case SEARCH_COMMAND:
		case PLAY_COMMAND:
			const guild = client.guilds.cache.get(interaction.guildId);
			const member = guild.members.cache.get(interaction.member.user.id);
			const voiceChannel = member.voice.channel;
			if (!voiceChannel) {
				interaction.reply("You must be in a voice channel to play music!");
				break;
			} else {
				try {
					joinVoiceChannel({
						channelId: voiceChannel.id,
						guildId: guild.id,
						adapterCreator: guild.voiceAdapterCreator
					});
				} catch (err) {
					interaction.reply("I can't join with you!");
				}
			}
		default:
			break;
	}

	switch (commandName) {
		case SEARCH_COMMAND:
			lastCommand.set(interaction.guildId, interaction.userId, {
				command: SEARCH_COMMAND,
				results: await executeSearch(interaction)
			});
			break;
		default:
			break;
	}
}

const handleButton = async (interaction) => {
    const guildId = interaction.guildId;
    const userId = interaction.userId;

    await interaction.deferReply();

	const { command, results } = lastCommand.get(guildId, userId);
	
	await interaction.message.delete();
    // Need to check if the button clicked belongs to the same message as last command

    switch (command) {
		case SEARCH_COMMAND:
			const songIndex = parseInt(interaction.customId);
			serverQueue.push(guildId, results[songIndex]);
			interaction.editReply({
				content: `Track **${results[songIndex].title}** added to the queue!`,
			});
			break;
		default:
			interaction.editReply({
				content: `What?`,
			});
			break;
	}
}
