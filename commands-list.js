const { Constants } = require('discord.js');
exports.commandsList = [
  {
    name: 'ping',
    description: 'You say PING I say PONG!',
  },
  {
    name: 'math',
    description: 'Math expression',
    options: [
      {
        name: 'expression',
        description: 'Just type your math',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING,
      },
    ],
  },
  {
    name: 'search',
    description: 'Search song by name',
    options: [
      {
        name: 'song',
        description: 'Name of the song',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING,
      },
      {
        name: 'limit',
        description: 'How many results do you want?',
        required: false,
        type: Constants.ApplicationCommandOptionTypes.NUMBER,
      },
    ],
  },
  {
    name: 'play',
    description: 'Play song by name/url',
    options: [
      {
        name: 'song',
        description: 'Name of the song',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING,
      },
    ],
  },
  {
    name: 'skip',
    description: 'Skip songs',
    options: [
      {
        name: 'number',
        description: 'How many songs do you want to skip?',
        required: false,
        type: Constants.ApplicationCommandOptionTypes.NUMBER,
      },
    ],
  },
  {
    name: 'join',
    description: 'Me joining',
  },
  {
    name: 'leave',
    description: 'Me leaving',
  },
];
