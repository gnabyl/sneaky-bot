import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import { VideoSearchResult, search as yts } from 'yt-search';

import { Track } from '@/utils/track';

async function buildSearchResultResponse(res: Track[]) {
  let response = `Here are ${res.length} results:`;
  const buttonsRow = new MessageActionRow();

  for (let i = 0; i < res.length; i++) {
    response += `\n**${String(i).padStart(3, ' ')}**. ${res[i].title} - (${
      res[i].duration
    })`;
    buttonsRow.addComponents(
      new MessageButton()
        .setCustomId(i.toString())
        .setLabel(i.toString())
        .setStyle('PRIMARY')
    );
  }

  return { response, buttonsRow };
}

export async function executeSearch(interaction: CommandInteraction) {
  const options = interaction.options;
  const songName = options.getString('song') || '';
  const limit = options.getNumber('limit') || 5;

  await interaction.deferReply();

  const searchResult = await yts(songName);
  const limitedResult = searchResult.videos.slice(0, limit);
  const res = limitedResult.map((v: VideoSearchResult): Track => {
    return new Track({
      url: v.url,
      title: v.title,
      author: v.title,
      duration: v.timestamp,
      onStart: () => {
        interaction.channel.send(`Now playing ${v.title}!`);
      },
      onFinish: () => {
        interaction.channel.send(`Finished ${v.title}!`);
      },
      onError: (err) => {
        interaction.channel.send(`Error occurred while playing ${v.title} :(`);
        console.error(err);
      },
    });
  });

  const { response, buttonsRow } = await buildSearchResultResponse(res);
  await interaction.editReply({
    content: response,
    components: [buttonsRow],
  });

  return res;
}
