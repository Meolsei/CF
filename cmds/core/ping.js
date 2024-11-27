const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency.'),

    async execute(interaction) {
        const start = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = start.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`Bot latency is: ${latency}ms.\nAPI latency is: ${interaction.client.ws.ping}ms.`);
    },
};