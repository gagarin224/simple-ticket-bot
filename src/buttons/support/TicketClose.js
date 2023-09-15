const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const DatabaseHelper = require('../../helpers/DatabaseHelper');
const SimpleTicketButton = require('../../structures/SimpleTicketButton');
const TicketService = require('../../services/TicketService');
const { findChannel, checkBotPermission, checkSupportRole, checkUserSupportRole, checkUserPermissions } = require('../../utils/Functions');

class TicketClose extends SimpleTicketButton {
    constructor() {
        super('ticketClose');
    }

    async run(client, interaction) {
        if (!interaction.guild.cache) return;

        const { guildId, user, channelId, message } = interaction;
        const { supportChannel, notificationChannel, closeCategory, supportRole, messageId, numberTicket, timeTicketDelete } = interaction.guild.cache;

        const guild = client.guilds.cache.get(guildId);
        const channel = findChannel(guild, channelId);
        const ticketMember = await guild.members.fetch(user.id).catch(() => {});
        const moderator_roles = guild.roles.cache.filter(r => supportRole.includes(r.id));

        if (!checkBotPermission(guild, PermissionsBitField.Flags.ManageChannels)) return interaction.fail('ℹ️ | The bot doesn`t have the right to manage the channels');
        if (!checkUserSupportRole(ticketMember, moderator_roles) && !checkUserPermissions(ticketMember, PermissionsBitField.Flags.ManageRoles)) return interaction.fail('ℹ️ | You are not a support agent/you do not have the right to \`ManageRoles\`.');

        const dataTicket = await DatabaseHelper.findTicket({ guildId, channelId: channel.id });
        if (!dataTicket) return interaction.fail('ℹ️ | This ticket is not found in the database');
        if (dataTicket.status === 2) return interaction.fail('ℹ️ | This ticket is already closed');

        if (!supportRole || supportRole.length === 0) return interaction.fail('ℹ️ | Technical support roles not found');

        if (checkSupportRole(moderator_roles).length === 0) return interaction.fail('ℹ️ | Specified support agent roles are not found on the server (deleted)');

        const close_category = findChannel(guild, closeCategory);
        if (!close_category) return interaction.fail('ℹ️ | Close tickets category not found');

        if (close_category.children.size >= 45) return interaction.fail('ℹ️ | The close tickets category is full');

        const member = await guild.members.fetch(dataTicket.userId).catch(() => {});

        channel.setParent(close_category.id).catch(err => {});

        const ticket = new TicketService(client);

        const permissions = ticket._buildChannelPermissions(2, guildId, member.id, moderator_roles);
        const buttons = ticket._buildStatisticsButton(false, false, true);
        const rating_buttons = ticket._buildRatingButtons();

        const embed = ticket._buildEmbed('#f5a60a', 'Evaluation of the support agent`s performance', false,
        '**[1️⃣] - Terrible answer**\n' +
        '**[2️⃣] - Bad answer**\n' +
        '**[3️⃣] - Normal answer**\n' +
        '**[4️⃣] - Good answer**\n' +
        '**[5️⃣] - Perfect answer**',
        false, `© Support Team by Swallow^^${client.user.avatarURL()}`, true);

        channel.permissionOverwrites.set(permissions).catch(err => {});

        await interaction.send({ content: `${member}, your ticket has been changed to status: \`Closed\`. Source: ${ticketMember}`, embeds: [embed], components: [rating_buttons] });

        const duration = parseInt(timeTicketDelete);

        dataTicket.timeToDelete = Date.now() + duration;
        dataTicket.status = 2;
        dataTicket.agentId = ticketMember.id;
        dataTicket.save();

        message.edit({ components: [buttons] }).catch(err => {});

        const reportsChannel = findChannel(guild, notificationChannel);
        if (reportsChannel) reportsChannel.send({ embeds: [ticket._buildInformationEmbed(2, interaction)] });

        if (messageId) ticket._updateStatisticsEmbed(guild, supportChannel, messageId, numberTicket);

        return await interaction.reply({ content: `You have successfully closed this ticket`, ephemeral: true }).catch(() => {});
    }
}

module.exports = TicketClose;