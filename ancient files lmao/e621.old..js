const { SlashCommandBuilder, messageLink, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType } = require('discord.js');
const fs = require('node:fs');
const { apiKey } = require('../../config.json');
const { maxHeaderSize } = require('node:http');
const { TIMEOUT } = require('node:dns');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('e621')
		.setDescription('Search e621 for content.')
        .addStringOption(option =>
            option
                .setName('search')
                .setDescription('Search query.')
                .setRequired(false)),
	async execute(interaction) {        
        const search = interaction.options.getString('search');

        const username = "Meolsei";
        const response = await fetch(`https://e621.net/posts.json?tags=${search}`, {
            headers: {'Authorization': "Basic " + btoa(`${username}:${apiKey}`)}
        }); data = await response.json()

        let num = 1

        const Embed = new EmbedBuilder()
            .setColor("#6942f5")
            .setTitle(`ID: ${data.posts[num].id}, made by ${data.posts[num].tags.artist[0]}`)
            .setURL(`https://e621.net/posts/${data.posts[num].id}`)
            .setDescription("Search query: " + search)
            .setImage(data.posts[num].file.url)
            .setTimestamp()
            .setFooter({text: "This command is a massive work in progress. If it breaks somewhere, let @meolsei know."});

        const msg = await interaction.reply({content: "Done~", embeds: [Embed], components: [row]});

        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 });

        collector.on('collect', async i => {

            const Embed2 = new EmbedBuilder()
                .setColor("#6942f5")
                .setTitle(`ID: ${data.posts[num].id}, made by ${data.posts[num].tags.artist[0]}`)
                .setURL(`https://e621.net/posts/${data.posts[num].id}`)
                .setDescription("Search query: " + search)
                .setImage(data.posts[num].file.url)
                .setTimestamp()
                .setFooter({text: "This command is a massive work in progress. If it breaks somewhere, let @meolsei know."});

            if (i.customId == 'back') {
                if (num > 1) {num--}
                await i.update({ content: num.toString(), embeds: [Embed2] })
            } else if (i.customId == 'forwards') {
                num++
                await i.update({ content: num.toString(), embeds: [Embed2] })
            }
            
        }
      );
    },
};
