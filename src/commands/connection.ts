import {
  VoiceConnectionStatus,
  createAudioPlayer,
  getVoiceConnection,
  joinVoiceChannel,
} from '@discordjs/voice';

import Container from 'typedi';
import { InteractiveInteraction } from '@/model/interaction';
import { SongQueue } from '@/utils/song-queue';

const queue = Container.get(SongQueue);

export function executeLeave(interaction: InteractiveInteraction) {
  try {
    getVoiceConnection(interaction.guildId).disconnect();
    interaction.reply({
      content: `Disconnected`,
      ephemeral: false,
    });
  } catch (err) {
    interaction.reply({
      content: `I'm not connected`,
      ephemeral: false,
    });
  }
}

export function executeJoin(interaction: InteractiveInteraction) {
  const guild = interaction.guild;
  const member = guild.members.cache.get(interaction.member.user.id);
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    return interaction.channel.send(
      'You must be in a voice channel to play music!'
    );
  }

  if (!queue.getQueue(guild.id)) {
    const queueObject = {
      textChannel: interaction.channel,
      voiceChannel,
      connection: null,
      player: createAudioPlayer(),
      songs: [],
      playing: true,
    };
    queue.setQueue(guild.id, queueObject);
  }

  queue.getQueue(guild.id).connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

  queue
    .getQueue(guild.id)
    .connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.log('Bot disconnected');
      queue.getQueue(guild.id).connection.destroy();
    });

  interaction.reply({
    content: `Connected`,
    ephemeral: false,
  });
}
