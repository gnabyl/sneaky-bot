const yts = require('yt-search');
const { MessageButton, MessageActionRow } = require("discord.js");

// Search and return list of songs, sort by view
const search = async (songName, limit) => {
	const searchResult = await yts(songName);
	const limitedResult = searchResult.videos.slice(0, limit);
	return limitedResult.map(v => {
		return {
			title: v.title,
			views: v.views,
			timestamp: v.timestamp,
			author: v.author.name,
			videoId: v.videoId
		};
	});
}

const buildSearchResultResponse = (res) => {
	let response = `Here are ${res.length} results:`;

	const buttonsRow = new MessageActionRow();

	for (let i = 0; i < res.length; i ++) {
		response += `\n**${String(i).padStart(3, ' ')}**. ${res[i].title} - (${res[i].timestamp})`;
		buttonsRow.addComponents(
			new MessageButton()
				.setCustomId(i.toString())
				.setLabel(i.toString())
				.setStyle("PRIMARY")
		);
	}

	return { response, buttonsRow };
}


const executeSearch = async (interaction) => {
	const options = interaction.options;
	const songName = options.getString("song") || "";
	const limit = options.getNumber("limit") || 5;

	await interaction.deferReply();

	const res = await search(songName, limit);

	const { response, buttonsRow } = buildSearchResultResponse(res);

	await interaction.editReply({
		content: response,
		components: [buttonsRow]
	});

	return res;
}

exports.executeSearch = executeSearch;