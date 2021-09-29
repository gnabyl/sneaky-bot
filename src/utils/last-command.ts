import { ILastCommand } from '@/model/last-commands';
import { Service } from 'typedi';

@Service()
export class LastCommand {
  // Store the last command executed by a user in guild
  // => lastCommand[guid][uid] -> { messageId: string, command: string, results: [] }
  lastCommand: ILastCommand;

  constructor() {
    this.lastCommand = new Map();
  }

  set = (guildId, userId, commandObject) => {
    if (!this.lastCommand[guildId]) {
      this.lastCommand[guildId] = new Map();
    }

    this.lastCommand[guildId][userId] = commandObject;
  };

  get = (guildId, userId) => {
    if (!this.lastCommand[guildId]) {
      this.lastCommand[guildId] = new Map();
    }

    if (!this.lastCommand[guildId][userId]) {
      this.lastCommand[guildId][userId] = {
        command: '',
        results: [],
      };
    }

    return this.lastCommand[guildId][userId];
  };
}
