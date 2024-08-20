const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong! :3'),
    async execute(interaction) {
        await interaction.reply('Pong! :3');
    },
};