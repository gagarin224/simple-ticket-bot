const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const DatabaseHelper = require('../helpers/DatabaseHelper');
const Ticket = require('../structures/TicketSchema');
const Guild = require('../structures/GuildSchema');
const BlockSupport = require('../structures/BlockSupportSchema');
const { findChannel, checkBotPermission } = require('../utils/Functions');

class TicketService {
    constructor(client) {
        this.client = client;
    }

    _translateStatus(status) {
        let text;
        switch(status) {
            case 0: text = 'open'; break;
            case 1: text = 'pending'; break;
            case 2: text = 'closed'; break;
        }
        
        return text;
    }

    _buildStatisticsButton(first_button, second_button, third_button) {
        const buttons = new ActionRowBuilder()

        .addComponents(
            new ButtonBuilder()
            .setCustomId('ticketActive')
            .setStyle(ButtonStyle.Success)
            .setLabel(`Открыть`)
            .setDisabled(first_button)
            .setEmoji('🔓'),
            new ButtonBuilder()
            .setCustomId('ticketHold')
            .setStyle(ButtonStyle.Primary)
            .setLabel(`Взять на рассмотрение`)
            .setDisabled(second_button)
            .setEmoji('🙋'),
            new ButtonBuilder()
            .setCustomId('ticketClose')
            .setStyle(ButtonStyle.Danger)
            .setLabel(`Закрыть`)
            .setDisabled(third_button)
            .setEmoji('🔒')
        );

        return buttons;
    }

    _buildChannelPermissions(status, guildId, userId, moderator_role) {
        let users_to_support = [];
        switch (status) {
            case 0:
                users_to_support = [{
                    id: guildId,
                    deny: [PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.SendTTSMessages, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.SendMessagesInThreads, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads, PermissionsBitField.Flags.UseExternalStickers, PermissionsBitField.Flags.ManageThreads, PermissionsBitField.Flags.UseApplicationCommands]
                }];

                users_to_support.push({
                    id: userId,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.UseExternalStickers],
                    deny: [PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.SendTTSMessages, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.SendMessagesInThreads, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads, PermissionsBitField.Flags.ManageThreads, PermissionsBitField.Flags.UseApplicationCommands]
                });

                moderator_role.forEach(moderator => {
                    users_to_support.push({
                        id: moderator.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.AddReactions],
                        deny: [PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.SendTTSMessages, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.RequestToSpeak, PermissionsBitField.Flags.UseApplicationCommands, PermissionsBitField.Flags.ManageThreads, PermissionsBitField.Flags.UseExternalStickers, PermissionsBitField.Flags.SendMessagesInThreads, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads]
                    });
                });
                break;

            case 1:
                users_to_support = [{
                    id: guildId,
                    deny: [PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.SendTTSMessages, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.SendMessagesInThreads, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads, PermissionsBitField.Flags.UseExternalStickers, PermissionsBitField.Flags.ManageThreads, PermissionsBitField.Flags.UseApplicationCommands]
                }];
        
                users_to_support.push({
                    id: userId,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.UseExternalStickers],
                    deny: [PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.SendTTSMessages, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.SendMessagesInThreads, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads, PermissionsBitField.Flags.ManageThreads, PermissionsBitField.Flags.UseApplicationCommands]
                });
        
                moderator_role.forEach(moderator => {
                    users_to_support.push({
                        id: moderator.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.AddReactions],
                        deny: [PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.SendTTSMessages, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.RequestToSpeak, PermissionsBitField.Flags.UseApplicationCommands, PermissionsBitField.Flags.ManageThreads, PermissionsBitField.Flags.UseExternalStickers, PermissionsBitField.Flags.SendMessagesInThreads, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads]
                    });
                });
                break;

            case 2:
                users_to_support = [{
                    id: guildId,
                    deny: [PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.SendTTSMessages, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.SendMessagesInThreads, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads, PermissionsBitField.Flags.UseExternalStickers, PermissionsBitField.Flags.ManageThreads, PermissionsBitField.Flags.UseApplicationCommands]
                }];
        
                moderator_role.forEach(moderator => {
                    users_to_support.push({
                        id: moderator.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                        deny: [PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.SendTTSMessages, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.SendMessagesInThreads, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads, PermissionsBitField.Flags.UseExternalStickers, PermissionsBitField.Flags.ManageThreads, PermissionsBitField.Flags.UseApplicationCommands]
                    });
                });
        
                users_to_support.push({
                    id: userId,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory],
                    deny: [PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.SendTTSMessages, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.UseExternalEmojis, PermissionsBitField.Flags.AddReactions, PermissionsBitField.Flags.SendMessagesInThreads, PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.CreatePrivateThreads, PermissionsBitField.Flags.UseExternalStickers, PermissionsBitField.Flags.ManageThreads, PermissionsBitField.Flags.UseApplicationCommands]
                });
                break;
        }

        return users_to_support;
    }

    _buildStatisticsEmbed(data, { active, hold, close, all }) {
        const embed = new EmbedBuilder()
        .setFields([
            {
                name: 'Ticket statistics',
                value: 
                `Opened tickets: \`${active}\`\n` +
                `Pending tickets: \`${hold}\`\n` +
                `Closed tickets: \`${close}\`\n` +
                `Tickets for all time: \`${all}\``
            }
        ]);

        if (data.color) embed.setColor(data.color);
        if (data.title) embed.setTitle(data.title);
        if (data.description) embed.setDescription(`${data.description}`);
        if (data.image) embed.setImage(data.image);

        return embed;
    }

    _buildCreateEmbed(interaction, channel) {
        return new EmbedBuilder()
        .setColor(0x03fc03)
        .setTitle('ℹ️ | Ticket is created')
        .setDescription(`**User** \`${interaction.member.displayName}\` **has created an ticket for support** ${channel} \`[${channel.name}/${channel.id}]\``)
        .setFooter({ text: this.client.user.username, iconURL: this.client.user.avatarURL() })
        .setTimestamp();
    }

    _buildInformationEmbed(status, interaction) {
        return new EmbedBuilder()
        .setColor(0x03fc03)
        .setTitle('ℹ️ | Ticket status has been updated')
        .setDescription(`**Support Agent** \`${interaction.member.displayName}\` **changed the status of the ticket** ${interaction.channel} **on** \`${this._translateStatus(status)}\``)
        .setFooter({ text: this.client.user.username, iconURL: this.client.user.avatarURL() })
        .setTimestamp();
    }

    async _updateStatisticsEmbed(guild, channelId, messageId, numberTicket) {
        const messageSupport = await guild.channels.cache.get(channelId).messages.fetch(messageId).catch(() => {});
        if (!messageSupport) return;

        const data = await DatabaseHelper.findTicketsEntrys({ guildId: guild.id });

        const statisticsEmbed = this._buildStatisticsEmbed(guild.cache, { active: data[0], hold: data[1], close: data[2], all: numberTicket });
        try {
            await messageSupport.edit({ embeds: [statisticsEmbed] });
        } catch (error) {
            console.log(error)
        }
    }

    _buildRatingButtons() {
        const buttons = new ActionRowBuilder()

        .addComponents(
            new ButtonBuilder()
                .setCustomId('ticketOneButton')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('1️⃣'),
            new ButtonBuilder()
                .setCustomId('ticketTwoButton')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('2️⃣'),
            new ButtonBuilder()
                .setCustomId('ticketThreeButton')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('3️⃣'),
            new ButtonBuilder()
                .setCustomId('ticketFourButton')
                .setStyle(ButtonStyle.Success)
                .setEmoji('4️⃣'),
            new ButtonBuilder()
                .setCustomId('ticketFiveButton')
                .setStyle(ButtonStyle.Success)
                .setEmoji('5️⃣')
        );

        return buttons;
    }

    _buildEmbed(color, title, author, description, thumbnail, footer, timestamp) {
        let embed = new EmbedBuilder()
        if (color) embed.setColor(color)
        if (title) embed.setTitle(title)
        if (author) embed.setAuthor({ name: author.name, iconURL: author.iconURL() })
        if (description) embed.setDescription(description)
        if (thumbnail) embed.setThumbnail(thumbnail.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        if (footer) embed.setFooter({ text: footer.split('^^')[0], iconURL: footer.split('^^')[1] })
        if (timestamp) embed.setTimestamp()

        return embed;
    }

    async _ticketDelete(client) {
        const channels = await Ticket.find({ status: 2 });

        channels.forEach(async (g) => {
            const guild = client.guilds.cache.get(g.guildId);
            if (!guild) return;

            const data = await Guild.findOne({ guildId: guild.id });
            if (!data) return;

            const channel = guild.channels.cache.find(c => c.id == g.channelId);
            if (!channel) return;

            const now = new Date();
            const time = g.timeToDelete;

            if (time <= now) {
                const member = await guild.members.fetch(g.userId).catch(() => {});

                if (!checkBotPermission(guild, PermissionsBitField.Flags.ManageChannels)) return;

                const attachment = await discordTranscripts.createTranscript(channel, {
                    limit: -1,
                    returnType: 'attachment',
                    filename: `${channel.name}.html`, 
                    saveImages: true,
                    poweredBy: false
                });

                const { supportChannel ,notificationChannel, messageId, numberTicket } = data.support;
                const reportsChannel = findChannel(guild, notificationChannel);

                try {
                    if (reportsChannel) await reportsChannel.send({ content: `\`[SYSTEM]\` \`Ticket ${channel.name} was deleted and saved to the database. The file contains the contents of the ticket\``, files: [attachment] });

                    if (member) await member.send({ content: `\`[SYSTEM]\` \`Hello! Your ticket ${channel.name} was deleted and saved to the database. The file contains the contents of the ticket\``, files: [attachment] })
                    .catch(err => { if(err.message == `Cannot send messages to this user`) {}})

                } catch (e) {
                    if (reportsChannel) await reportsChannel.send({ content: `\`[SYSTEM]\` \`Ticket ${channel.name} was deleted and saved to the database. The file contains the contents of the ticket\``, files: [attachment] });
                }

                channel.delete().catch(err => {});

                let ticketDB = await Ticket.findOne({ channelId: g.channelId, guildId: g.guildId });
                ticketDB.status = 3;
                await ticketDB.save();

                if (messageId) this._updateStatisticsEmbed(guild, supportChannel, messageId, numberTicket);
            }
        });
    }

    async _checkBlockSupport() {
        const now = Date.now();

        const request = {
            expires: {
                $lt: now,
            },
            current: true
        }

        const results = await BlockSupport.find(request);

        if (results) {

            await BlockSupport.updateMany(request, {
                current: false
            });
        }
    }
}

module.exports = TicketService;