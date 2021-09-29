import { Client, Intents, Interaction } from 'discord.js';
import 'reflect-metadata';
import Container from 'typedi';
import { DiscordBot } from './utils/client';
import { Handlers } from './utils/handlers';

// Create a new client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// Setup client
const bot = Container.get(DiscordBot);
bot.initDiscordBot(client);

// Once actions
bot.onReady();
bot.onReconnecting();
bot.onDisconnect();

// Handlers DI
const handlers = Container.get(Handlers);

// Subscriptions
bot.onInteractionCreate(async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    handlers.handleCommand(interaction);
    return;
  }
  if (interaction.isButton()) {
    handlers.handleButton(interaction);
    return;
  }
});
