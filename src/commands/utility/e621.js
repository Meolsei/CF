const { SlashCommandBuilder, messageLink, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType, Embed } = require("discord.js");
const { apiKey } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("e621")
        .setDescription("Search e621 for content.")
        .addStringOption(option =>
            option
                .setName("search")
                .setDescription("Search query.")
                .setRequired(false)),

    async execute(interaction) {
        const search = interaction.options.getString("search");

        const username = "Meolsei";
        const response = await fetch(`https://e621.net/posts.json?tags=${search}`, {
            headers: { "Authorization": "Basic " + btoa(`${username}:${apiKey}`) }
        }); data = await response.json()

        function makeEmbed(post) {
            return new EmbedBuilder()
                .setColor("#dd9ac2")
                .setTitle(`ID: ${post.id}${post.tags.artist.length > 0 ? `, made by ${post.tags.artist[0]}` : ""}`)
                .setURL(`https://e621.net/posts/${post.id}`)
                .setDescription(search !== null ? `Search query: ${search}` : null)
                .setImage(post.file.url)
                .setTimestamp()
                .setFooter({ text: "Command made by Meolsei.\nThis command is a massive work in progress. If it breaks somewhere, let @meolsei know." });
        }

        return this.client.menus.create(interaction, data.posts, {
            loop: false,
            hideStopButton: false,
            hideExitButton: false,
            removeButtonsOnStop: true,
            makeContent: null,
            makeEmbed: makeEmbed,
        });

    }
}