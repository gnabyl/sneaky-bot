const { commandsList } = require('./commands-list');
const { Client, Intents } = require('discord.js');

const token = process.env.BOT_TOKEN;

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.once('ready', async () => {
  console.log('Initializing commands handler...');

  const guildId = process.env.GUILD_ID;
  const guild = client.guilds.cache.get(guildId);

  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application.commands;
  }

  for (const c of commandsList) {
    await commands.create(c);
    console.log(`Command ${c.name} deployed`);
  }

  console.log('Finish!');

  process.exit();
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});
client.once('disconnect', () => {
  console.log('Disconnect!');
});

// Login to Discord with your client"s token
client.login(token);
