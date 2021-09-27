import * as math from 'mathjs';

import { ButtonInteraction, CommandInteraction, Message } from 'discord.js';
import Container, { Service } from 'typedi';
import { executeJoin, executeLeave } from '@/commands/connection';

import { Commands } from '@/model/last-commands';
import { LastCommand } from './last-command';
import { QueueManager } from './queue-manager';
import { playAfterSearch } from '@/commands/play';
import { executeSearch } from '@/commands/search';
import { executeSkip } from '@/commands/skip';

@Service()
export class Handlers {
  lastCommand: LastCommand;
  queue: QueueManager;

  constructor() {
    this.lastCommand = Container.get(LastCommand);
    this.queue = Container.get(QueueManager);
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

      case Commands.MATH:
        const expr = options.getString('expression');

        try {
          const result = math.evaluate(expr);
          interaction.reply({
            content: `${expr} = ${result.toString()}`,
            ephemeral: false,
          });
        } catch (err) {
          interaction.reply({
            content: 'Đéo biết làm toán à',
            ephemeral: false,
          });
        }

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
          results: await executeSkip(interaction),
        });
        break;

      case Commands.LEAVE:
        executeLeave(interaction);
        break;

      case Commands.JOIN:
        executeJoin(interaction);
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
    playAfterSearch(interaction, results[songIndex]);
  }
}
