const { Constants } = require("discord.js");
exports.commandsList = [
    {
        "name": "ping",
        "description": "You say PING I say PONG!"
    },
    {
        "name": "add",
        "description": "Add two numbers",
        "options": [
            {
                "name": "number1",
                "description": "First number",
                "required": true,
                "type": Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                "name": "number2",
                "description": "Second number",
                "required": true,
                "type": Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    }
]