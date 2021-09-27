import { CommandInteraction, GuildMember } from 'discord.js';
import { QueueManager } from '@/utils/queue-manager';
import { createAudioPlayer } from '@discordjs/voice';
import Container from 'typedi';

export async function executeSkip(interaction: CommandInteraction) {
  // Defer
  await interaction.deferReply();

  const queueManager = Container.get(QueueManager);
  const queue = queueManager.getQueue(interaction.guild.id);
  const userVoiceChannel = (interaction.member instanceof GuildMember) ? (interaction.member.voice.channel) : null;

  // No voice channel
  if (!userVoiceChannel) {
    return interaction.editReply(
      'You must be in a voice channel to skip music!'
    );
  }

  // Not same voice channel
  if (queue.voiceChannel.id !== userVoiceChannel.id) {
    return interaction.editReply(
      'You must be in the same voice channel to skip music!'
    );
  }

  if (!queue) {
    await interaction.editReply("I'm not playing!");
  } else if (queue.songs.length == 0) {
    await interaction.editReply('Empty queue!');
  } else {
    // Stop the player makes it become Idle, which will automatically play next song
    queue.audioPlayer.stop(true);
    await interaction.editReply("Track skipped");
  }
}
