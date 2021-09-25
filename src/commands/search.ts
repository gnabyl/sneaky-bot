import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import * as yts from 'yt-search';

async function search(songName: string, limit: number) {
  const searchResult = await yts(songName);
  const limitedResult = searchResult.videos.slice(0, limit);
  return limitedResult.map((v) => {
    return {
      title: v.title,
      views: v.views,
      timestamp: v.timestamp,
      author: v.author.name,
      videoId: v.videoId,
      url: v.url,
    };
  });
}

async function buildSearchResultResponse(res) {
  let response = `Here are ${res.length} results:`;
  const buttonsRow = new MessageActionRow();

  for (let i = 0; i < res.length; i++) {
    response += `\n**${String(i).padStart(3, ' ')}**. ${res[i].title} - (${
      res[i].timestamp
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

  const res = await search(songName, limit);
  const { response, buttonsRow } = await buildSearchResultResponse(res);
  await interaction.editReply({
    content: response,
    components: [buttonsRow],
  });

  return res;
}
