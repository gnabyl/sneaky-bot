// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { prefix, token } = require('./config.json');
const ytdl = require('ytdl-core');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const queue = new Map();

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});
client.once('reconnecting', () => {
  console.log('Reconnecting!');
});
client.once('disconnect', () => {
  console.log('Disconnect!');
});

// Login to Discord with your client's token
client.login(token);