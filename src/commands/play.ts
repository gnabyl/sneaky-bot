import { connect } from '@/commands/connection';
import { InteractiveInteraction } from '@/model/interaction';
import { SearchManager } from '@/model/search-manager';
import { QueueManager } from '@/utils/queue-manager';
import { Track } from '@/utils/track';
import { CommandInteraction } from 'discord.js';
import { Container } from 'typedi';

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

/**
 * This function is used to play a song by name/url
 */
export async function executePlay(interaction: CommandInteraction) {
  const queueManager = Container.get(QueueManager);

  await interaction.deferReply();

  const input = interaction.options.getString('input');
  const searchResult = await SearchManager.search(input);

  const track = new Track({
    url: searchResult.url,
    title: searchResult.title,
    author: searchResult.title,
    duration: searchResult.duration,
    onStart: () => {
      interaction.channel.send(`Now playing ${searchResult.title}!`);
    },
    onFinish: () => {
      interaction.channel.send(`Finished ${searchResult.title}!`);
    },
    onError: (err) => {
      interaction.channel.send(
        `Error occurred while playing ${searchResult.title} :(`
      );
      console.error(err);
    },
  });

  if (await connect(interaction)) {
    queueManager.getQueue(interaction.guild.id).addTrack(track);
    await interaction.editReply(`Track **${track.title}** added to the queue!`);
  }
}
