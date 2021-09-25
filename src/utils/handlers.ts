import { ButtonInteraction, CommandInteraction, Message } from 'discord.js';
import Container, { Service } from 'typedi';
import { executeSearch } from '@/commands/search';
import { executeSkip } from '@/commands/skip';
import { Commands } from '@/model/last-commands';
import { LastCommand } from './last-command';
import { SongQueue } from './song-queue';
import { executePlay } from '@/commands/play';

@Service()
export class Handlers {
  lastCommand: LastCommand;
  queue: SongQueue;

  constructor() {
    this.lastCommand = Container.get(LastCommand);
    this.queue = Container.get(SongQueue);
  }

  public async handleCommand(interaction: CommandInteraction) {
    const { commandName, options } = interaction;

    switch (commandName) {
      // Normal command
      case 'ping':
        interaction.reply({
          content: 'PONG!',
          ephemeral: true,
        });
        break;

      case 'add':
        const firstNumber = options.getNumber('number1') || 0;
        const secondNumber = options.getNumber('number2') || 0;
        const res = firstNumber + secondNumber;

        interaction.reply({
          content: res.toString(),
          ephemeral: true,
        });
        break;

      case Commands.SEARCH:
        this.lastCommand.set(interaction.guildId, interaction.user.id, {
          command: Commands.SEARCH,
          results: await executeSearch(interaction),
        });
        break;

      case Commands.SKIP:
        this.lastCommand.set(interaction.guildId, interaction.user.id, {
          command: Commands.SKIP,
          results: await executeSkip(interaction, this.queue),
        });
        break;

      default:
        break;
    }
  }

  public async handleButton(interaction: ButtonInteraction) {
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const { command, results } = this.lastCommand.get(guildId, userId);

    // Message type checking
    if (interaction.message instanceof Message)
      await interaction.message.delete();

    // Need to check if the button clicked belongs to the same message as last command
    switch (command) {
      case Commands.SEARCH:
        this.handleSearchButton(interaction, results);
        break;
      default:
        interaction.editReply({
          content: `What?`,
        });
        break;
    }
  }

  private handleSearchButton(interaction: ButtonInteraction, results) {
    const songIndex = +interaction.customId;
    executePlay(interaction, this.queue, results[songIndex]);
  }
}