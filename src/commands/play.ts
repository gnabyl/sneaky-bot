
import {
  VoiceConnectionStatus,
  entersState,
  joinVoiceChannel,
} from '@discordjs/voice';

import { GuildMember } from 'discord.js';
import { InteractiveInteraction } from '@/model/interaction';
import { QueueManager } from '@/utils/queue-manager';
import { Container } from 'typedi';
import { QueueObject } from '@/utils/queue-object';
import { Track } from '@/utils/track';

const TIMEOUT = parseInt(process.env.timeout);

export async function playAfterSearch(interaction: InteractiveInteraction, track: Track) {
  const guild = interaction.guild;

  const queueManager = Container.get(QueueManager);
  let queue = queueManager.getQueue(guild.id);

  // If a queue of the guild doesn't already exist
  // and the user is in a voice channel, join that channel
  // and create a queue.
  if (!queue) {
    if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
      const userVoiceChannel = interaction.member.voice.channel;
      queue = new QueueObject(
        joinVoiceChannel({
          channelId: userVoiceChannel.id,
          guildId: userVoiceChannel.guild.id,
          adapterCreator: userVoiceChannel.guild.voiceAdapterCreator,
        }),
        userVoiceChannel
      );
      queue.voiceConnection.on('error', console.warn);
      queueManager.setQueue(interaction.guildId, queue);
    }
  }

  // If still doesn't exist => User is not in a channel
  if (!queue) {
    await interaction.editReply("You must be in a channel to play music!");
    return;
  }

  // Make sure the connection is ready before processing the user's request
  try {
    await entersState(queue.voiceConnection, VoiceConnectionStatus.Ready, TIMEOUT);
  } catch (error) {
    console.warn(error);
    await interaction.editReply(`Failed to join voice channel within ${TIMEOUT}ms, please try again later!`);
    return;
  }

  queue.addTrack(track);
  await interaction.editReply(`Track **${track.title}** added to the queue!`);
}