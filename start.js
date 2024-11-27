// Dotenv
const dotenv = require('dotenv')
dotenv.config()

// Filesystem
const fs = require('node:fs');
const path = require('node:path');

// Discord
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// child_process
const { spawnSync } = require('child_process');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'cmds');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[W] The command at ${filePath} is missing a required property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

console.log("Deploying...")
spawnSync('node deploy.js', {shell: true, stdio: 'inherit'});
client.login(process.env.TOKEN);