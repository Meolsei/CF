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
                .setFooter({ text: "Command made by MeltyMooncakes & Meolsei.\nThis command is a massive work in progress. If it breaks somewhere, let @meltymooncakes or @meolsei know." });
        }

        //https://cdn.discordapp.com/attachments/755167499032723559/1245186101367275594/untitled.mp4?ex=669a692d&is=669917ad&hm=d6077d51cfbf6893f0cc63d59ef580eafeba17d91011062380b5704cb22b12e1&

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