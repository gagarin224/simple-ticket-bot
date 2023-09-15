const { Collection, PermissionFlagsBits } = require('discord.js');
const Guild = require('../structures/GuildSchema');
const User = require('../structures/UserSchema');
const GuildDataCache = require('../structures/cache/GuildDataCache');
const UserDataCache = require('../structures/cache/UserDataCache');
const DatabaseHelper = require('../helpers/DatabaseHelper');

const cooldown = new Collection();

class CommandExecutorService {
    constructor(interaction, client) {
        this.interaction = interaction;
        this.client = client || interaction.client;
    }

    async runCommand() {
        if (this.interaction.user.bot) return;

        if (!this.interaction.guild?.cache) {
            const data = await Guild.findOne({ guildId: this.interaction.guild.id });
            if (!data) DatabaseHelper.createGuildEntry({ guildId: this.interaction.guild.id });
            
            this.interaction.guild.cache = new GuildDataCache(data);
        }

        if (!this.interaction.user?.cache) {
            const data = await User.findOne({ guildId: this.interaction.guild.id, userId: this.interaction.user.id });
            if (!data) DatabaseHelper.createUserEntry({ guildId: this.interaction.guild.id, userId: this.interaction.user.id });
            
            this.interaction.user.cache = new UserDataCache(data);
        }

        const command = this.client.commands.get(this.interaction.commandName) || null;

        if (command) {
            if (!this.interaction.guild.members.me.permissionsIn(this.interaction.channel).has(PermissionFlagsBits.EmbedLinks)) return this.interaction.reply({ content: 'У меня нет права на встраивание ссылок, пожалуйста, выдайте мне его, чтобы я смог работать корректно!' });

            try {
                command.run(this.client, this.interaction);
            } catch(error) {
                console.error(error);
            }

            if (command.cooldown != 0) { 
                cooldown.set(this.interaction.user.id, command.name);
                setTimeout(() => cooldown.delete(this.interaction.user.id), command.cooldown * 1000);
            }
        }
    }
}

module.exports = CommandExecutorService;