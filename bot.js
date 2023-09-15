require('./src/utils/Extenders');

const { GatewayIntentBits, Partials } = require('discord.js');
const SimpleTicketClient = require('./src/structures/SimpleTicketClient.js');

const client = new SimpleTicketClient({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel, 
        Partials.Message, 
        Partials.User, 
        Partials.GuildMember, 
        Partials.Reaction
    ],
    disableMentions: 'everyone'
});

client._launch();