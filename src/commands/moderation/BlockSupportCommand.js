const { PermissionsBitField } = require('discord.js');
const ms = require('ms');
const DatabaseHelper = require('../../helpers/DatabaseHelper');
const SimpleTicketCommand = require('../../structures/SimpleTicketCommand');
const { checkUserSupportRole, checkUserPermissions, plural } = require('../../utils/Functions');
const TicketService = require('../../services/TicketService');

class BlockSupportCommand extends SimpleTicketCommand {
    constructor() {
        super('blocksupport', {
            description: 'Issue a support block to the user',
            options: [
                {
                    name: 'user',
                    description: 'Specify the user to be blocked from accessing the support',
                    type: 6,
                    required: true
                },
                {
                    name: 'time',
                    description: 'Specify the time (example: 30m or 2h)',
                    type: 3,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'Specify the reason for issuing the blocksupport',
                    type: 3,
                    required: false
                }
            ]
        });
    }

    async run(client, interaction) {
        const { user, guildId } = interaction;
        const { supportRole } = interaction.guild.cache;
        const guild = client.guilds.cache.get(guildId);
        const commandMember = await guild.members.fetch(user.id).catch(() => {});
        const interaction_user = interaction.options.getUser('user');
        const interaction_time = interaction.options.getString('time');
        let interaction_reason = interaction.options.getString('reason');

        const member = await guild.members.fetch(interaction_user.id).catch(() => {});
        const moderator_roles = guild.roles.cache.filter(r => supportRole.includes(r.id));

        if (!checkUserSupportRole(commandMember, moderator_roles) && !checkUserPermissions(commandMember, PermissionsBitField.Flags.ManageRoles)) return interaction.fail('ℹ️ | You are not a support agent/you do not have the right to \`ManageRoles\`.');

        if (member.id === client.user.id) return interaction.fail('ℹ️ | You can`t punish a bot');

        if (member.id === commandMember.id) return interaction.fail('ℹ️ | You can`t give out a punishment to yourself');

        if (member.roles.highest.position >= commandMember.roles.highest.position) return interaction.fail('ℹ️ | The role of this user is higher or equal to yours');

        if (member.roles.highest.position >= guild.members.me.roles.highest.position) return interaction.fail('ℹ️ | This role is higher than my');

        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.fail('ℹ️ | This user is an administrator');

        const data = await DatabaseHelper.checkSupportBan({ guildId, userId: member.id });
        if (data) return interaction.fail('ℹ️ | This user has already been blocked from accessing support');

        const seconds = parseInt(interaction_time);
        const minutes = parseInt(interaction_time);
        const hours = parseInt(interaction_time);
        const days = parseInt(interaction_time);

        let blocktime;

        if (interaction_time.includes(`${seconds}s`)) {
            if (seconds < 1 || seconds > 31536000) return interaction.fail('ℹ️ | You can`t give out a punishment for more than 1 year');
            blocktime = `${interaction_time.split(`s`).join(` ${plural([`second`, `seconds`, `seconds`], seconds)}`)}`;
        } else if (interaction_time.includes(`${minutes}m`)) {
            if (seconds < 1 || seconds > 525600) return interaction.fail('ℹ️ | You can`t give out a punishment for more than 1 year');
            blocktime = `${interaction_time.split(`s`).join(` ${plural([`minute`, `minutes`, `minutes`], minutes)}`)}`;
        } else if (interaction_time.includes(`${hours}h`)) {
            if (seconds < 1 || seconds > 8760) return interaction.fail('ℹ️ | You can`t give out a punishment for more than 1 year');
            blocktime = `${interaction_time.split(`s`).join(` ${plural([`hour`, `hours`, `hours`], hours)}`)}`;
        } else if (interaction_time.includes(`${days}d`)) {
            if (seconds < 1 || seconds > 365) return interaction.fail('ℹ️ | You can`t give out a punishment for more than 1 year');
            blocktime = `${interaction_time.split(`s`).join(` ${plural([`day`, `days`, `days`], days)}`)}`;
        }

        if (!interaction_reason) interaction_reason = 'Reason not provided';

        const duration = ms(interaction_time);

        const expires = Date.now() + duration;

        DatabaseHelper.createBlockSupportEntry({ userId: member.id, guildId, reason: interaction_reason, staffId: commandMember.id, expires, current: true });

        const helper = new TicketService(client);

        const embed = helper._buildEmbed('Green', 'Successfull', false,
        `You have successfully blocked access to the support user ${member} to \`${blocktime}\`. Reason: \`${interaction_reason}\``,
        false, false, true);

        await interaction.reply({ embeds: [embed] }).catch(() => {}).then(async() => {
            const notificationEmbed = helper._buildEmbed('Red', 'Notification', false,
            `You have been blocked from accessing the support channel on the server \`${guild.name}\`` +
            `\nBanned by: \`${commandMember.user.tag}\`` +
            `\nBlocked time: \`${blocktime}\`` +
            `\nReason: \`${interaction_reason}\``,
            false, false, true);

            await member.send({ embeds: [notificationEmbed] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}});
        });
    }
}

module.exports = BlockSupportCommand;