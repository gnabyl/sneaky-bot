
import { InteractiveInteraction } from '@/model/interaction';
import { QueueManager } from '@/utils/queue-manager';
import { Container } from 'typedi';
import { Track } from '@/utils/track';
import { connect } from '@/commands/connection';


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
