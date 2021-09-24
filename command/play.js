const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const player = createAudioPlayer();

const play = async (guild, queue) => {
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

        try {
            await entersState(player, AudioPlayerStatus.Idle);
            play(guild, queue);
        } catch (err) {
            console.error(err);
        }
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
        const queueObject = {
            textChannel: interaction.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            playing: true
        }
        queue.setQueue(guild.id, queueObject);
        queue.addSong(guild.id, songRequest);
        try {
            var connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator
            });
            queueObject.connection = connection;
            play(guild, queue);
        } catch (err) {
            console.error(err);
            queue.destroyQueue(guild.id);
            return interaction.editReply(err);
        }
    } else {
        queue.addSong(guild.id, songRequest);
    }
    return interaction.editReply(`Track **${songRequest.title}** added to the queue!`);
}

exports.executePlay = executePlay;