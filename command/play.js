const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const player = createAudioPlayer();

// const play = (guildId, queue) => {
//     const song = queue.getSong(guildId);
//     if (!song) {
//         queue.destroyQueue(guildId);
//         return;
//     }
//     const connection = getVoiceConnection(guildId);
//     if (connection.subscribe(player)) {
//         const stream = ytdl(song.url);
//         const resource = createAudioResource(stream);
//         player.play(resource);
//         queue.getQueue(guildId).textChannel.send(`Playing now...${song.title}`);
//     }
// }

function play(guild, queue) {
    console.log(queue.showQueue(guild.id));
    const song = queue.getSong(guild.id);
    if (!song) {
        queue.getQueue(guild.id).voiceChannel.leave();
        queue.destroyQueue(guild.id);
        return;
    }
  
    if (queue.getQueue(guild.id).connection.subscribe(player)) {
        const stream = ytdl(song.url);
        const resource = createAudioResource(stream);
        player.play(resource);
        queue.getQueue(guild.id).textChannel.send(`Now playing: **${song.title}**`);
    }

}

const executePlay = async (interaction, queue, songRequest) => {
    const guild = interaction.guild;
	const member = guild.members.cache.get(interaction.member.user.id);
	const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        return interaction.editReply("You must be in a voice channel to play music!");
    } 
    
    if (!queue.getQueue(guild.id)) {
        console.log("Empty queue found");
        const queueObject = {
            textChannel: interaction.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            playing: true
        }
        console.log("Init queue");
        queue.setQueue(guild.id, queueObject);
        console.log("Add song");
        queue.addSong(guild.id, songRequest);
        try {
            console.log("Connect to voice");
            var connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator
            });
            queueObject.connection = connection;
            console.log("Play");
            play(guild, queue);
        } catch (err) {
            console.log(err);
            queue.destroyQueue(guild.id);
            return interaction.editReply(err);
        }
    } else {
        queue.addSong(guild.id, songRequest);
        return interaction.editReply(`Track **${songRequest.title}** added to the queue!`);
    }
}

exports.executePlay = executePlay;