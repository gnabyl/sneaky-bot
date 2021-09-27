import { CommandInteraction, GuildMember } from 'discord.js';
import { QueueManager } from '@/utils/queue-manager';
import { AudioPlayerStatus } from '@discordjs/voice';
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

  // No queue
  if (!queue) {
    await interaction.editReply("Empty queue!");
    return;
  }

  if (queue.voiceChannel.id !== userVoiceChannel.id) {
    await interaction.editReply(
      'You must be in the same voice channel to skip music!'
    );
    return;
  }
  if (queue.audioPlayer.state.status === AudioPlayerStatus.Playing) {
    // Stop the player makes it become Idle, which will automatically play next song
    queue.audioPlayer.stop(true);
    await interaction.editReply("Track skipped!");
  } else {
    await interaction.editReply("I'm not playing anything!");
  }
}
