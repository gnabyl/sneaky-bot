import { connect } from '@/commands/connection';
import { InteractiveInteraction } from '@/model/interaction';
import { QueueManager } from '@/utils/queue-manager';
import { Track } from '@/utils/track';
import { CommandInteraction } from 'discord.js';
import { Container } from 'typedi';
import { search as yts } from 'yt-search';

export async function playAfterSearch(
  interaction: InteractiveInteraction,
  track: Track
) {
  const queueManager = Container.get(QueueManager);

  await interaction.deferReply();

  if (await connect(interaction)) {
    queueManager.getQueue(interaction.guild.id).addTrack(track);
    await interaction.editReply(`Track **${track.title}** added to the queue!`);
  }
}

export async function executePlay(interaction: CommandInteraction) {
  const queueManager = Container.get(QueueManager);

  await interaction.deferReply();

  const songName = interaction.options.getString('song');

  const searchResult = await yts(songName);

  const video = searchResult.videos[0];
  const track = new Track({
    url: video.url,
    title: video.title,
    author: video.title,
    duration: video.timestamp,
    onStart: () => {
      interaction.channel.send(`Now playing ${video.title}!`);
    },
    onFinish: () => {
      interaction.channel.send(`Finished ${video.title}!`);
    },
    onError: (err) => {
      interaction.channel.send(
        `Error occurred while playing ${video.title} :(`
      );
      console.error(err);
    },
  });

  if (await connect(interaction)) {
    queueManager.getQueue(interaction.guild.id).addTrack(track);
    await interaction.editReply(`Track **${track.title}** added to the queue!`);
  }
}
