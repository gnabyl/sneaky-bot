const dotenv = require('dotenv');
const { Client, Intents } = require("discord.js");

dotenv.config();

const prefix = process.env.PREFIX;
const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const queue = new Map();

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
  if (!interaction.isCommand()) {
    return;
  }
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
      const res = firstNumber + secondNumber;

      interaction.reply({
        content: res.toString(),
        ephemeral: true
      });

      break;
    default:
      break;
  }
});