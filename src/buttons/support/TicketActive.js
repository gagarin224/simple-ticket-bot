const { PermissionsBitField } = require('discord.js');
const DatabaseHelper = require('../../helpers/DatabaseHelper');
const SimpleTicketButton = require('../../structures/SimpleTicketButton');
const TicketService = require('../../services/TicketService');
const { findChannel, checkBotPermission, checkSupportRole, checkUserSupportRole, checkUserPermissions } = require('../../utils/Functions');

class TicketActive extends SimpleTicketButton {
    constructor() {
        super('ticketActive');
    }

    async run(client, interaction) {
        if (!interaction.guild.cache) return;

        const { guildId, user, channelId, message } = interaction;
        const { supportChannel, notificationChannel, activeCategory, supportRole, messageId, numberTicket } = interaction.guild.cache;

        const guild = client.guilds.cache.get(guildId);
        const channel = findChannel(guild, channelId);
        const ticketMember = await guild.members.fetch(user.id).catch(() => {});
        const moderator_roles = guild.roles.cache.filter(r => supportRole.includes(r.id));

        if (!checkBotPermission(guild, PermissionsBitField.Flags.ManageChannels)) return interaction.fail('ℹ️ | The bot doesn`t have the right to manage the channels');
        if (!checkUserSupportRole(ticketMember, moderator_roles) && !checkUserPermissions(ticketMember, PermissionsBitField.Flags.ManageRoles)) return interaction.fail('ℹ️ | You are not a support agent/you do not have the right to \`ManageRoles\`.');

        const dataTicket = await DatabaseHelper.findTicket({ guildId, channelId });
        if (!dataTicket) return interaction.fail('ℹ️ | This ticket is not found in the database');
        if (dataTicket.status === 0) return interaction.fail('ℹ️ | This ticket is already open');

        if (!supportRole || supportRole.length === 0) return interaction.fail('ℹ️ | Technical support roles not found');

        if (checkSupportRole(moderator_roles).length === 0) return interaction.fail('ℹ️ | Specified support agent roles are not found on the server (deleted)');

        const hold_category = findChannel(guild, activeCategory);
        if (!hold_category) return interaction.fail('ℹ️ | Active tickets category not found');

        if (hold_category.children.size >= 45) return interaction.fail('ℹ️ | The active tickets category is full');

        const member = await guild.members.fetch(dataTicket.userId).catch(() => {});
        if (!member) return interaction.fail('ℹ️ | The user has left the server. Close the ticket');

        channel.setParent(hold_category.id).catch(err => {});

        const ticket = new TicketService(client);

        const permissions = ticket._buildChannelPermissions(0, guildId, member.id, moderator_roles);
        const buttons = ticket._buildStatisticsButton(true, false, false);

        await channel.permissionOverwrites.set(permissions).catch(err => {});

        await interaction.send({ content: `${member}, your ticket has been changed to status: \`In Processing\`. Source: ${ticketMember}`, ephemeral: true });

        await DatabaseHelper.updateTicket({ guildId, userId: ticketMember.id, channelId, status: 0 });

        message.edit({ components: [buttons] }).catch(err => {});

        const reportsChannel = findChannel(guild, notificationChannel);
        if (reportsChannel) reportsChannel.send({ embeds: [ticket._buildInformationEmbed(0, interaction)] });

        if (messageId) ticket._updateStatisticsEmbed(guild, supportChannel, messageId, numberTicket);

        return await interaction.reply({ content: `You have successfully changed the status of the ticket to \`open\`.`, ephemeral: true }).catch(() => {});
    }
}

module.exports = TicketActive;