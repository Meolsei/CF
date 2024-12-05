const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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

            const start = await interaction.reply({ content: 'Pinging...', fetchReply: true });
            const latency = start.createdTimestamp - interaction.createdTimestamp;

            const embed = new EmbedBuilder()
                .setColor(0x6b03fc)
                .setTitle('Bot Latency')
                .addFields(
                    { name: 'Bot Latency', value: `${latency}ms`},
                    { name: 'API Latency', value: `${interaction.client.ws.ping}ms`}
                )
            
            await start.edit({ embeds: [embed] })
        },

};