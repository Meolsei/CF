// Dotenv
const dotenv = require('dotenv')
dotenv.config()

// Discord
const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready as ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN);