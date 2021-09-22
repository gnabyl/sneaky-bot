const yts = require('yt-search');

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

exports.search = search;