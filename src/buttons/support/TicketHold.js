const { PermissionsBitField } = require('discord.js');
const DatabaseHelper = require('../../helpers/DatabaseHelper');
const SimpleTicketButton = require('../../structures/SimpleTicketButton');
const TicketService = require('../../services/TicketService');
const { findChannel, checkBotPermission, checkSupportRole, checkUserSupportRole, checkUserPermissions } = require('../../utils/Functions');

class TicketHold extends SimpleTicketButton {
    constructor() {
        super('ticketHold');
    }

    async run(client, interaction) {
        if (!interaction.guild.cache) return;

        const { guildId, user, channelId, message } = interaction;
        const { supportChannel, notificationChannel, holdCategory, supportRole, messageId, numberTicket } = interaction.guild.cache;

        const guild = client.guilds.cache.get(guildId);
        const channel = findChannel(guild, channelId);
        const ticketMember = await guild.members.fetch(user.id).catch(() => {});
        const moderator_roles = guild.roles.cache.filter(r => supportRole.includes(r.id));

        if (!checkBotPermission(guild, PermissionsBitField.Flags.ManageChannels)) return interaction.fail('ℹ️ | The bot doesn`t have the right to manage the channels');
        if (!checkUserSupportRole(ticketMember, moderator_roles) && !checkUserPermissions(ticketMember, PermissionsBitField.Flags.ManageRoles)) return interaction.fail('ℹ️ | You are not a support agent/you do not have the right to \`ManageRoles\`.');

        const dataTicket = await DatabaseHelper.findTicket({ guildId, channelId });
        if (!dataTicket) return interaction.fail('ℹ️ | This ticket is not found in the database');
        if (dataTicket.status === 1) return interaction.fail('ℹ️ | This ticket is already pending');

        if (!supportRole || supportRole.length === 0) return interaction.fail('ℹ️ | Technical support roles not found');

        if (checkSupportRole(moderator_roles).length === 0) return interaction.fail('ℹ️ | Specified support agent roles are not found on the server (deleted)');

        const hold_category = findChannel(guild, holdCategory);
        if (!hold_category) return interaction.fail('ℹ️ | Pending tickets category not found');

        if (hold_category.children.size >= 45) return interaction.fail('ℹ️ | The pending tickets category is full');

        const member = await guild.members.fetch(dataTicket.userId).catch(() => {});
        if (!member) return interaction.fail('ℹ️ | The user has left the server. Close the ticket');

        channel.setParent(hold_category.id).catch(err => {});

        const ticket = new TicketService(client);

        const permissions = ticket._buildChannelPermissions(1, guildId, member.id, moderator_roles);
        const buttons = ticket._buildStatisticsButton(false, true, false);
        const holdEmbed = ticket._buildEmbed('#0a5ef0', `Support agent team ${guild.name}`, false,
        `**Hello!**\n**Your question will be answered by a support agent - **\`${ticketMember.displayName}\``,
        false, `© Support Team by Swallow^^${client.user.avatarURL()}`, true);

        await channel.permissionOverwrites.set(permissions).catch(err => {});

        await interaction.send({ content: `${member}, your ticket has been changed to status: \`Pending\`. Source: ${ticketMember}`, embeds: [holdEmbed] });

        await DatabaseHelper.updateTicket({ guildId, userId: ticketMember.id, channelId, status: 1 });
        if (interaction.user.cache) interaction.user.cache.holdTicket += 1;

        message.edit({ components: [buttons] }).catch(err => {});

        const reportsChannel = findChannel(guild, notificationChannel);
        if (reportsChannel) reportsChannel.send({ embeds: [ticket._buildInformationEmbed(1, interaction)] });

        if (messageId) ticket._updateStatisticsEmbed(guild, supportChannel, messageId, numberTicket);

        return await interaction.reply({ content: `You have been successfully assigned as a support agent on this ticket`, ephemeral: true }).catch(() => {});
    }
}

module.exports = TicketHold;