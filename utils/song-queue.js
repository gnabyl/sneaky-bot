module.exports = class SongQueue {
	constructor() {
		this.queue = new Map();
	}

	setQueue(guildId, queueObject) {
		this.queue[guildId] = queueObject;
	}

	getQueue(guildId) {
		return this.queue[guildId];
	}

	addSong(guildId, songRequest) {
		if (!this.queue[guildId].songs) {
			this.queue[guildId].songs = [];
		}
		this.queue[guildId].songs.push(songRequest);
	}

	getSong(guildId) {
		if (!this.queue[guildId]) {
			return null;
		}
		return this.queue[guildId].songs.shift();
	}

	isEmpty(guildId) {
		return (!this.queue[guildId] || this.queue[guildId].songs.length == 0);
	}

	showQueue(guildId) {
		return this.queue[guildId].songs;
	}

	destroyQueue(guildId) {
		this.queue[guildId] = null;
		this.queue.delete(guildId);
	}
}