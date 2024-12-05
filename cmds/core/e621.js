const { ButtonInteraction } = require('discord.js');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const dotenv = require('dotenv').config({ path: __dirname + '/.../' })

module.exports = {
    data: new SlashCommandBuilder()
        .setName('media')
        .setDescription('Gather media from API.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('How many to post')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('rating')
                .setDescription('Content rating.')
                .setRequired(true)
                .addChoices(
                    { name: "NSFW", value: 'rating:e'},
                    { name: "Both", value: 'rating:e rating:q rating:s'},
                    { name: "SFW", value: 'rating:s'},
                )
        )
        .addStringOption(option => 
            option.setName('search')
                .setDescription('Your search query.')
        ),

        async execute(interaction) {      
            // Options
            const search = interaction.options.getString('search');
            const rating = interaction.options.getString('rating');
            const amount = interaction.options.getInteger('amount');
            
            // API
            const username = "Meolsei";
            const apiKey = "mj9uRDUYJeUQdxoDgrVSXHtd";
            const response = await fetch(`https://e621.net/posts.json?limit=${amount}&tags=${search} ${rating}`, {
                headers: {
                    "Authorization": "Basic " + btoa(`${username}:${apiKey}`),
                    "User-Agent": "NyaBot/1.0 (Meolsei)"
                }
              });
            
            const data = await response.json();

            const embeds = data.posts.map((post, index) => {
                return new EmbedBuilder()
                    .setTitle(`Post ${index + 1} of ${amount}`)
                    .setImage(post.file.url)
            });

            let currentPage = 0;

            const firstEmbed = embeds[currentPage];
            const prevButton = new ButtonBuilder().setCustomId('prev').setLabel('Previous').setStyle(ButtonStyle.Primary).setDisabled(true);
            const nextButton = new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

            const sentMessage = await interaction.reply({
                embeds: [firstEmbed],
                components: [row],
                fetchReply: true,
            });

            const collector = sentMessage.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async (ButtonInteraction) => {
                if (ButtonInteraction.user.id !== interaction.user.id) {
                    return ButtonInteraction.reply({ content: 'You cannot interact with this embed., ephemeral: true '});
                }

                if (ButtonInteraction.customId === 'next') {
                    currentPage = Math.min(currentPage + 1, embeds.length - 1);
                } else if (ButtonInteraction.customId === 'prev') {
                    currentPage = Math.max(currentPage - 1, 0);
                }

                await ButtonInteraction.update({
                    embeds: [embeds[currentPage]],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId('prev').setLabel('Previous').setStyle(ButtonStyle.Primary).setDisabled(currentPage === 0),
                            new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary).setDisabled(currentPage === embeds.length - 1),
                        ),
                    ] });
            });

            collector.on('end', () => {
                sentMessage.edit({
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId('prev').setLabel('Previous').setStyle(ButtonStyle.Primary).setDisabled(true),
                            new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary).setDisabled(true)
                        ),
                    ],
                });
            });
        },
};