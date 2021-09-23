module.exports = class SongQueue {
    constructor() {
        this.queue = new Map();
    }

    push(guildId, songRequest) {
        if (!this.queue[guildId]) {
            this.queue[guildId] = [];
        }
        this.queue[guildId].push(songRequest);
    }

    pop(guildId) {
        if (!this.queue[guildId]) {
            return null;
        }
        return this.queue[guildId].shift();
    }
}