const { SlashCommandBuilder, messageLink } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
		const delay = Math.abs(Date.now() - interaction.createdTimestamp);
		await interaction.editReply(`Pong!\n${interaction.client.user} has ${delay}ms of latency..`)
	},
};
