import { CommandInteraction } from 'discord.js';
import { SongQueue } from '@/utils/song-queue';
import { createAudioPlayer } from '@discordjs/voice';
import { connectAndPlay } from './play';

export async function executeSkip(
  interaction: CommandInteraction,
  queue: SongQueue
) {
  // Defer
  await interaction.deferReply();

  const guild = interaction.guild;
  const member = guild.members.cache.get(interaction.member.user.id);
  const voiceChannel = member.voice.channel;

  // Empty
  if (!queue.getQueue(guild.id)) {
    return interaction.editReply('Empty queue!');
  }

  // No voice ch
  if (!voiceChannel) {
    return interaction.editReply(
      'You must be in a voice channel to skip music!'
    );
  }

  // Not same voice channel
  if (queue.getQueue(guild.id)?.voiceChannel?.id !== voiceChannel.id) {
    return interaction.editReply(
      'You must be in the same voice channel to skip music!'
    );
  }

  const options = interaction.options;
  const optionsNumber = options.getNumber('number') || 1;

  await queue.getQueue(guild.id).player.stop();
  queue.getQueue(guild.id).player = createAudioPlayer();

  console.log(queue.getQueue(guild.id).player);

  if (queue.getQueue(guild.id)) {
    for (let i = 0; i < optionsNumber - 1; i++) {
      queue.getSong(guild.id);
    }
  }

  await interaction.editReply({
    content: `Skipped ${optionsNumber} tracks!`,
  });

  connectAndPlay(guild, queue);
}
