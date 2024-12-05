const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv').config({ path: __dirname + '/.../' })
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload the bot\'s commands.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)
            
        ),
        

        async execute(interaction) {           
            if (!process.env.OWNERID.includes(interaction.user.id)) {
                await interaction.reply(`Only developers can use this command.`);
                return;
            }

            try {
                const commandsDir = path.join(__dirname, '..');
                const files = await scanFiles(commandsDir);

                for (const file of files) {
                    const commandPath = file;
                    delete require.cache[require.resolve(commandPath)];

                    try {
                        const newCommand = require(commandPath);
                        interaction.client.commands.set(newCommand.data.name, newCommand);
                        console.log(`Command ${newCommand.data.name} reloaded.`);
                    } catch (error) {
                        console.error(`Error reloading command ${file}:`, error);
                    }
                }

                await interaction.reply(`All commands have been reloaded`);
            } catch (error) {
                console.error(error);
                await interaction.reply(`An error occured attempting to reload the commands:\n${error.message}`);
            }
        },

};

async function scanFiles(dir) {
    let files = [];
    const items = await fs.promises.readdir(dir, { withFileTypes: true});

    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            const subFiles = await scanFiles(fullPath);
            files = files.concat(subFiles);
        } else if (item.isFile() && item.name.endsWith('js')) {
            files.push(fullPath);
        }
    }

    return files;
}