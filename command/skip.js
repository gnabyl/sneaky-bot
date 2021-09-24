const { createAudioPlayer } = require("@discordjs/voice");
const { connectAndPlay } = require("./play");

const executeSkip = async (interaction, queue) => {
	await interaction.deferReply();
    const guild = interaction.guild;
	const member = guild.members.cache.get(interaction.member.user.id);
	const voiceChannel = member.voice.channel;

    if (!queue.getQueue(guild.id)) {
        return interaction.editReply("Empty queue!");
    }

    if (!voiceChannel) {
        return interaction.editReply("You must be in a voice channel to skip music!");
    }

    if (queue.getQueue(guild.id)?.voiceChannel?.id != voiceChannel.id) {
        return interaction.editReply("You must be in the same voice channel to skip music!");
    }
    
    const options = interaction.options;
	const number = options.getNumber("number") || 1;

    await queue.getQueue(guild.id).player.stop();
    queue.getQueue(guild.id).player = createAudioPlayer();

    console.log(queue.getQueue(guild.id).player);
    
    if (queue.getQueue(guild.id)) {
        for (let i = 0; i < number - 1; i ++) {
            queue.getSong(guild.id);
        }
    }

	await interaction.editReply({
		content: `Skipped ${number} tracks!`
	});

    connectAndPlay(guild.id, queue);
}

exports.executeSkip = executeSkip;