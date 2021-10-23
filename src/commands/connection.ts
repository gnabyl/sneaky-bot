import { InteractiveInteraction } from '@/model/interaction';
import { QueueManager } from '@/utils/queue-manager';
import { QueueObject } from '@/utils/queue-object';
import { Track } from '@/utils/track';
import {
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { GuildMember } from 'discord.js';
import Container from 'typedi';

const queueManager = Container.get(QueueManager);
const TIMEOUT = Number(process.env.timeout);

export async function executeLeave(interaction: InteractiveInteraction) {
  const queue = queueManager.getQueue(interaction.guild.id);
  await interaction.deferReply();
  if (queue) {
    queue.voiceConnection.destroy();
    await interaction.editReply('Disconnected');
  } else {
    await interaction.editReply("I'm not connected");
  }
}

export async function executeJoin(interaction: InteractiveInteraction) {
  await interaction.deferReply();

  if (await connect(interaction)) {
    await interaction.editReply({
      content: `Connected`,
    });
  }
}

export async function connect(
  interaction: InteractiveInteraction
): Promise<boolean> {
  const guild = interaction.guild;

  let queue = queueManager.getQueue(guild.id);

  // If user in a channel => create/restore queue
  // Connect if needed
  if (
    interaction.member instanceof GuildMember &&
    interaction.member.voice.channel
  ) {
    const userVoiceChannel = interaction.member.voice.channel;
    let oldSongs: Track[] = [];
    if (queue) {
      if (queue.voiceChannel.id === userVoiceChannel.id) {
        return true;
      }
      oldSongs = queue.songs;
    }
    queue = new QueueObject(
      joinVoiceChannel({
        channelId: userVoiceChannel.id,
        guildId: userVoiceChannel.guild.id,
        adapterCreator: userVoiceChannel.guild.voiceAdapterCreator,
      }),
      userVoiceChannel
    );
    queue.songs = oldSongs;
    queue.voiceConnection.on('error', console.warn);
    queueManager.setQueue(interaction.guildId, queue);
  } else {
    await interaction.editReply(
      'You must be in a voice channel to use music command!'
    );
    return false;
  }
  // Make sure the connection is ready before processing the user's request
  try {
    await entersState(
      queue.voiceConnection,
      VoiceConnectionStatus.Ready,
      TIMEOUT
    );
  } catch (error) {
    console.warn(error);
    await interaction.editReply(
      `Failed to join voice channel within ${TIMEOUT}ms, please try again later!`
    );
    return false;
  }
  return true;
}
