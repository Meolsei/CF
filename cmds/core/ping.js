const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv').config({ path: __dirname + '/.../' })

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency.'),

        async execute(interaction) {           
            if (!process.env.OWNERID.includes(interaction.user.id)) {
                await interaction.reply(`Only developers can use this command.`);
                return;
            }
            else {
                const start = await interaction.reply({ content: 'Pinging...', fetchReply: true });
                const latency = start.createdTimestamp - interaction.createdTimestamp;
                await interaction.editReply(`Bot latency is: ${latency}ms.\nAPI latency is: ${interaction.client.ws.ping}ms.`);
            }
        },

};