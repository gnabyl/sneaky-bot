const dotenv = require('dotenv');
const { Client, Intents, MessageButton, MessageActionRow } = require("discord.js");
const { search } = require('./command/search');

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
      res = firstNumber + secondNumber;

      interaction.reply({
        content: res.toString(),
        ephemeral: true
      });

      break;
    case "search":
      const songName = options.getString("song") || "";
      const limit = options.getNumber("limit") || 5;

      interaction.deferReply({
        ephemeral: true
      });

      res = await search(songName, limit);

      response = `Here are ${limit} results:`;

			const buttonsRow = new MessageActionRow();

      for (let i = 0; i < res.length; i ++) {
        response += `\n**${String(i).padStart(3, ' ')}**. ${res[i].title} - (${res[i].timestamp})`;
				buttonsRow.addComponents(
					new MessageButton()
						.setCustomId(i.toString())
						.setLabel(i.toString())
						.setStyle("PRIMARY")
				);
      }


      interaction.editReply({
        content: response,
				components: [buttonsRow]
      });
    default:
      break;
  }
});