const { ButtonInteraction } = require('discord.js');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const dotenv = require('dotenv').config({ path: __dirname + '/.../' })

module.exports = {
    data: new SlashCommandBuilder()
        .setName('e621')
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
                    { name: "SFW", value: 'rating:s'},
                )
        )
        .addStringOption(option => 
            option.setName('search')
                .setDescription('Your search query.')
        ),
        aliases: ['e6'],

        async execute(interaction) {      
            // Options
            const search = interaction.options.getString('search');
            const rating = interaction.options.getString('rating');
            const amount = interaction.options.getInteger('amount');
            
            // API
            const username = process.env.USERNAME;
            const apiKey = process.env.KEY;
            const response = await fetch(`https://e621.net/posts.json?limit=${amount}&tags=${search} ${rating}`, {
                headers: {
                    "Authorization": "Basic " + btoa(`${username}:${apiKey}`),
                    "User-Agent": "NyaBot/1.0 (Meolsei)"
                }
            });
            
            const data = await response.json();

            if (data.posts.length === 0) {
                return interaction.reply("No results found.");
            }

            const embeds = data.posts.map((post, index) => {
                if (!post.file || post.file.ext === 'mp4' || post.file.ext === 'webm') {
                    return null;  // Skip video posts
                }

                const customDate = (date) => {
                    const d = new Date(post.created_at);
                    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
                    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
                    const day = d.getDate();
                    const year = d.getFullYear();
                    const hours = String(d.getHours()).padStart(2, '0');
                    const minutes = String(d.getMinutes()).padStart(2, '0');
                
                    return `${weekday}, ${month} ${day}, ${year}, ${hours}:${minutes}`;
                };
                
                const formattedDate = customDate(new Date());
            
                const downloadURL = post.file.url;
                const embed = new EmbedBuilder()
                    .setTitle(`Post ${index + 1} of ${amount}.`)
                    .setDescription(`Score: ${post.score.total}.`)
                    .setImage(post.file.url)
                    .setFooter({ text: `Posted on ${formattedDate}\n\nNOTE: If the post number skips, that's because the post is a video. Videos cannot be placed in embeds.` });
            
                const downloadButton = new ButtonBuilder()
                    .setLabel('Download')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji('<:download:1314243283471433848>')
                    .setURL(downloadURL);
            
                return { embed, downloadButton };
            }).filter(item => item !== null);  // Remove null items (video posts)

            // Ensure currentPage is within bounds
            if (embeds.length === 0) {
                return interaction.reply("No valid posts found.");
            }
            
            let currentPage = 0;

            const firstEmbed = embeds[currentPage].embed;
            const downloadButton = embeds[currentPage].downloadButton;
            const prevButton = new ButtonBuilder().setCustomId('prev').setLabel('Previous').setStyle(ButtonStyle.Primary).setDisabled(true);
            const nextButton = new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(prevButton, nextButton, downloadButton);

            const sentMessage = await interaction.reply({
                embeds: [firstEmbed],
                components: [row],
                fetchReply: true,
            });

            const collector = sentMessage.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async (ButtonInteraction) => {
                if (ButtonInteraction.user.id !== interaction.user.id) {
                    return ButtonInteraction.reply({ content: 'You cannot interact with this embed.', ephemeral: true });
                }
            
                if (ButtonInteraction.customId === 'next') {
                    currentPage = Math.min(currentPage + 1, embeds.length - 1);
                } else if (ButtonInteraction.customId === 'prev') {
                    currentPage = Math.max(currentPage - 1, 0);
                }
            
                const currentPost = embeds[currentPage];
                if (!currentPost) {
                    return ButtonInteraction.reply({ content: 'This post is no longer available.', ephemeral: true });
                }
            
                const updateEmbed = currentPost.embed;
                const updateDownloadButton = currentPost.downloadButton;
            
                await ButtonInteraction.update({
                    embeds: [updateEmbed],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId('prev').setLabel('Previous').setStyle(ButtonStyle.Primary).setDisabled(currentPage === 0),
                            new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary).setDisabled(currentPage === embeds.length - 1),
                            updateDownloadButton
                        ),
                    ],
                });
            });
        },
};
