const SimpleTicketEvent = require('../structures/SimpleTicketEvent');
const Guild = require('../structures/GuildSchema');
const User = require('../structures/UserSchema');
const GuildDataCache = require('../structures/cache/GuildDataCache');
const UserDataCache = require('../structures/cache/UserDataCache');
const DatabaseHelper = require('../helpers/DatabaseHelper');

class MessageCreateEvent extends SimpleTicketEvent {
    constructor() {
        super('messageCreate');
    }

    async run(client, message) {
        if (message.author.bot) return;

        if (!message.guild?.cache) {
            const data = await Guild.findOne({ guildId: message.guild.id });
            if (!data) DatabaseHelper.createGuildEntry({ guildId: message.guild.id });
            
            message.guild.cache = new GuildDataCache(data);
        }

        if (!message.author?.cache) {
            const data = await User.findOne({ guildId: message.guild.id, userId: message.author.id });
            if (!data) DatabaseHelper.createUserEntry({ guildId: message.guild.id, userId: message.author.id });

            message.author.cache = new UserDataCache(data);
        }
    }
}

module.exports = MessageCreateEvent;