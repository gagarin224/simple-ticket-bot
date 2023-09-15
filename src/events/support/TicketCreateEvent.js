const { PermissionsBitField, ChannelType } = require('discord.js');
const TicketService = require('../../services/TicketService');
const SimpleTicketEvent = require('../../structures/SimpleTicketEvent');
const DatabaseHelper = require('../../helpers/DatabaseHelper');
const { findChannel, checkBotPermission, checkSupportRole, checkUserSupportRole } = require('../../utils/Functions');
const Ticket = require('../../structures/TicketSchema');

class TicketCreateEvent extends SimpleTicketEvent {
    constructor() {
        super('messageCreate');
    }

    async run(client, message) {
        if (message.author.bot) return;
        if (!message.guild.cache || !message.guild.cache.supportChannel) return;

        const { supportChannel, notificationChannel, numberTicket, activeCategory, supportRole, messageId } = message.guild.cache;
        const support_channel = findChannel(message.guild, supportChannel);

        if (message.channel === support_channel) {
            const dataTicket = await Ticket.findOne({ guildId: message.guild.id, userId: message.author.id, status: 0 });
            if (dataTicket) return message.fail('ℹ️ | You already have an open ticket');

            if (!checkBotPermission(message.guild, PermissionsBitField.Flags.ManageChannels)) return message.fail('ℹ️ | The bot doesn`t have the right to manage the channels');

            const dataBlockSupport = await DatabaseHelper.checkSupportBan({ userId: message.author.id, guildId: message.guild.id });
            if (dataBlockSupport) return message.fail('ℹ️ | You have been blocked from accessing support');

            if (message.content.length > 800 || message.content.length < 1) return message.fail('ℹ️ | Message length cannot be longer than 800 and less than 1 character long');

            if (!supportRole || supportRole.length === 0) return message.fail('ℹ️ | Technical support roles not found');

            const moderator_roles = message.guild.roles.cache.filter(r => supportRole.includes(r.id));

            if (checkSupportRole(moderator_roles).length === 0) return message.fail('ℹ️ | Specified support agent roles are not found on the server (deleted)');

            if (checkUserSupportRole(message.member, moderator_roles)) return message.fail('ℹ️ | Technical support agents are not allowed to create tickets');

            const active_category = findChannel(message.guild, activeCategory);
            if (!active_category) return message.fail('ℹ️ | Active tickets category not found');

            if (active_category.children.size >= 45) return message.fail('ℹ️ | The active tickets category is full');

            if (message.attachments.first()) {
                const type = message.attachments.first().contentType;
                if (!type.includes('image/')) return message.fail('ℹ️ | You can only attach a photo to the ticket');
            }

            const ticket = new TicketService(client);

            const permissions = ticket._buildChannelPermissions(0, message.guild.id, message.author.id, moderator_roles);
            const buttons = ticket._buildStatisticsButton(true, false, false);

            const channel = await message.guild.channels.create({
                name: `ticket-${numberTicket}`,
                type: ChannelType.GuildText,
                parent: active_category.id,
                permissionOverwrites: permissions
            });

            DatabaseHelper.createTicketEntry({ 
                guildId: message.guild.id, 
                userId: message.author.id, 
                channelId: channel.id, 
                numberTicket: numberTicket 
            });

            const roles = moderator_roles.sort((a, b) => b.position - a.position).map(role => role.toString());

            const supportEmbed = ticket._buildEmbed('Blurple', 'New ticket', false,
            `**👤 Username:** \`${message.author.tag}\`\n**🌐 ID:** \`${message.author.id}\`\n**💬 Essence of the appeal:** \`${message.content}\``,
            client.user, `Ticket system © Swallow^^${message.member.user.displayAvatarURL({ dynamic: true })}`, false);
            if (message.attachments.first()) supportEmbed.setImage(`${message.attachments.first().proxyURL}`)

            channel.send({ content: `${message.author} \`for the\` ${roles}`, embeds: [supportEmbed], components: [buttons] })
            .then(async(msgContent) => await msgContent.pin()).catch(err => {});

            const msg = await message.channel.send(`${message.author}, \`You have created appeal a support ticket ===>\` ${channel}`);

            setTimeout(() => {
                msg.delete().catch(err => {});
            }, 10000);

            const reportsChannel = findChannel(message.guild, notificationChannel);
            if (reportsChannel) reportsChannel.send({ embeds: [ticket._buildCreateEmbed(message, channel)] });

            if (messageId) ticket._updateStatisticsEmbed(message.guild, supportChannel, messageId, numberTicket);
        }
    }
}

module.exports = TicketCreateEvent;