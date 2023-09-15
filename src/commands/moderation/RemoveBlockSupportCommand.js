const { PermissionsBitField } = require('discord.js');
const DatabaseHelper = require('../../helpers/DatabaseHelper');
const SimpleTicketCommand = require('../../structures/SimpleTicketCommand');
const { checkUserSupportRole, checkUserPermissions, plural } = require('../../utils/Functions');
const TicketService = require('../../services/TicketService');

class RemoveBlockSupportCommand extends SimpleTicketCommand {
    constructor() {
        super('removeblocksupport', {
            description: 'Remove the support block to the user',
            options: [
                {
                    name: 'user',
                    description: 'Specify the user you want to remove block from the support',
                    type: 6,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'Specify the reason for removing the blocksupport',
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
        let interaction_reason = interaction.options.getString('reason');

        const member = await guild.members.fetch(interaction_user.id).catch(() => {});
        const moderator_roles = guild.roles.cache.filter(r => supportRole.includes(r.id));

        if (!checkUserSupportRole(commandMember, moderator_roles) && !checkUserPermissions(commandMember, PermissionsBitField.Flags.ManageRoles)) return interaction.fail('ℹ️ | You are not a support agent/you do not have the right to \`ManageRoles\`.');

        const data = await DatabaseHelper.checkSupportBan({ guildId, userId: member.id });
        if (!data) return interaction.fail('ℹ️ | This user is not blocked from accessing support');

        if (!interaction_reason) interaction_reason = 'Reason not provided';

        DatabaseHelper.updateBlockSupportStatus({ userId: member.id, guildId });

        const helper = new TicketService(client);

        const embed = helper._buildEmbed('Green', 'Successfull', false,
        `You have successfully unbanned access to the support user ${member}. Reason: \`${interaction_reason}\``,
        false, false, true);

        await interaction.reply({ embeds: [embed] }).catch(() => {}).then(async() => {
            const notificationEmbed = helper._buildEmbed('Green', 'Notification', false,
            `You have been unblocked access to support on the server \`${guild.name}\`` +
            `\nUnbanned by: \`${commandMember.user.tag}\`` +
            `\nReason: \`${interaction_reason}\``,
            false, false, true);

            await member.send({ embeds: [notificationEmbed] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}});
        });
    }
}

module.exports = RemoveBlockSupportCommand;