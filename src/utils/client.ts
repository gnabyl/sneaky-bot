import { Client, Interaction, Message } from 'discord.js';

import { Service } from 'typedi';
import { v4 } from 'uuid';

@Service()
export class DiscordBot {
  listeners = [];
  private client: Client;

  public initDiscordBot(client) {
    // Set client
    this.client = client;

    // Login
    this.login();
  }

  private login(callback: () => void = null): void {
    this.client
      .login(process.env.BOT_TOKEN)
      .then((response) => {
        if (callback) callback();
        else console.log(`Bot login: ${response}`);
      })
      .catch(console.error);
  }

  /**
   * Bot ready function
   * @param {() => void} callback: Callback function
   */
  public onReady(callback: () => void = null): void {
    this.client.once('ready', () => {
      if (callback) callback();
      else console.log('Ready');
    });
  }

  /**
   * Bot reconnecting function
   * @param {() => void} callback: Callback function
   */
  public onReconnecting(callback: () => void = null): void {
    this.client.once('reconnecting', () => {
      if (callback) callback();
      else console.log('Reconnecting!');
    });
  }

  /**
   * Bot disconnect function
   * @param {() => void} callback: Callback function
   */
  public onDisconnect(callback: () => void = null): void {
    this.client.once('disconnect', () => {
      if (callback) callback();
      else console.log('Disconnect!');
    });
  }

  /**
   * Add messageHandler for client
   * @param {(message: Message) => void} callback: Callback function
   * @returns {() => void}: Function to unsubscribe
   */
  public onMessage(
    callback: (message: Message) => void | Promise<void>
  ): () => void {
    // Assign events
    this.client.on('message', callback);

    // Set uuid
    const uuid = v4();

    // Register client
    this.listeners[uuid] = () => {
      this.client.off('message', callback);
    };

    return () => this.listeners[uuid]();
  }

  /**
   * Add messageHandler for client
   * @param {(message: Message) => void} callback: Callback function
   * @returns {() => void}: Function to unsubscribe
   */
  public onInteractionCreate(
    callback: (interaction: Interaction) => void | Promise<void>
  ): () => void {
    // Assign events
    this.client.on('interactionCreate', callback);

    // Set uuid
    const uuid = v4();

    // Register client
    this.listeners[uuid] = () => {
      this.client.off('interactionCreate', callback);
    };

    return () => this.listeners[uuid]();
  }
}
