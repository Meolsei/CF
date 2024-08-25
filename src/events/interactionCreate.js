const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isButton()) {
			if (/^MENU_(.+)$/.test(interaction.customId)) {
				const menuId = interaction.customId.replace(/(MENU_|_(BACK|NEXT|STOP))/gi, "");

				if (!interaction.client.menus.has(menuId)) {
					interaction.reply({
						content: "This menu is expired!",
						ephemeral: true,
					});

					return interaction.message.edit({
						content: interaction.message.content,
						embeds: interaction.message.embeds,
						components: [],
					});
				}

				const menu = interaction.client.menus.get(menuId);

				switch (interaction.customId.replace(/.+(?=(BACK|NEXT|STOP))/gi, "").toLowerCase()) {
					case "next": return await menu.next(interaction);
					case "stop": return await menu.stop(interaction);
					case "back": return await menu.back(interaction);
				}
			}
		} else if (interaction.isStringSelectMenu()) {
			// respond to the select menu
		}
	},
};