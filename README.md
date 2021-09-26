# sneaky-bot

A really simple, homemade discord bot which plays music, and does math.

# Setup
```
npm install
```
This command installs all the required dependencies.

# Run bot in local

We'll need a `.env` file which stores bot's token and some config to be able to run the bot.
Please take a look at .env-sample to setup your own `.env` file.

Run the bot using this command
```
npm run dev
```

# Run bot in production

# Create your own bot

1. Create an application and a bot in [Discord Developer Portal](https://discord.com/developers/applications).
2. Copy the bot's token and put it in the `.env` file.
3. Run it!

# Contributing

## Source code organization

`commands-list.js` - All the commands' definition.
`deploy-commands.js` - Script to deploy commands to servers. This script should be run only after updating/adding commands.
`src/commands/` - Code for commands go here.
`src/index.ts` - Where everything starts.