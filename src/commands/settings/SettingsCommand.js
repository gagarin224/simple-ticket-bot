const { PermissionsBitField } = require('discord.js');
const SimpleTicketCommand = require('../../structures/SimpleTicketCommand');
const { findChannel, checkUserPermissions, plural, timeConversion } = require('../../utils/Functions');
const TicketService = require('../../services/TicketService');

class SettingsCommand extends SimpleTicketCommand {
    constructor() {
        super('settings', {
            description: 'View bot settings',
        });
    }

    async run(client, interaction) {
        const { guildId, user } = interaction;

        const guild = client.guilds.cache.get(guildId);
        const commandMember = await guild.members.fetch(user.id).catch(() => {});

        if (!checkUserPermissions(commandMember, PermissionsBitField.Flags.ManageGuild)) return interaction.fail('ℹ️ | You don`t have the right to \`ManageGuild\`.');

        const { supportChannel, notificationChannel, activeCategory, holdCategory, closeCategory, timeTicketDelete } = interaction.guild.cache;

        let support = findChannel(guild, supportChannel)?.name || "None"
        let notification = findChannel(guild, notificationChannel)?.name || "None"
        let active = findChannel(guild, activeCategory)?.name || "None"
        let hold = findChannel(guild, holdCategory)?.name || "None"
        let close = findChannel(guild, closeCategory)?.name || "None"
        let time = timeConversion(plural, timeTicketDelete);

        const helper = new TicketService(client);

        const embed = helper._buildEmbed('#0eb7eb', false, guild, 
        `**[🔧] Technical support channel: **\`${support}\` **[🔧]**\n` +
        `**[🛡️] Log Ticket Channel: **\`${notification}\` **[🛡️]**\n` +
        `**[⌚] Active tickets category: **\`${active}\` **[⌚]**\n` +
        `**[📝] Pending tickets category: **\`${hold}\` **[📝]**\n` +
        `**[🔒] Closed tickets category: **\`${close}\` **[🔒]**\n` +
        `**[⏳] Ticket deletion time: **\`${time}\` **[⏳]**`,
        false, false, true)
        await interaction.reply({ embeds: [embed] }).catch(() => {});
    }
}

module.exports = SettingsCommand;