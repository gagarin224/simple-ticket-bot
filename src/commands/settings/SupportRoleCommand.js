const { PermissionsBitField } = require('discord.js');
const SimpleTicketCommand = require('../../structures/SimpleTicketCommand');
const { checkSupportRole, checkUserPermissions } = require('../../utils/Functions');
const TicketService = require('../../services/TicketService');
const DatabaseHelper = require('../../helpers/DatabaseHelper');

class SupportRoleCommand extends SimpleTicketCommand {
    constructor() {
        super('supportrole', {
            description: 'Add/Delete/List/Clear Technical Support Roles',
            options: [
                {
                    name: 'type',
                    description: 'Choose what to do',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Add a technical support role',
                            value: 'add'
                        },
                        {
                            name: 'Remove a technical support role',
                            value: 'remove'
                        },
                        {
                            name: 'View a list of technical support roles',
                            value: 'list'
                        },
                        {
                            name: 'Clear the list of technical support roles',
                            value: 'clear'
                        }
                    ]
                },
                {
                    name: 'role',
                    description: 'Choose one of the available roles',
                    type: 8,
                    required: false
                },
            ]
        });
    }

    async run(client, interaction) {
        const { guildId, user } = interaction;
        const guild = client.guilds.cache.get(guildId);
        const commandMember = await guild.members.fetch(user.id).catch(() => {});

        if (!checkUserPermissions(commandMember, PermissionsBitField.Flags.ManageGuild)) return interaction.fail('ℹ️ | You don`t have the right `Manage guild`');

        const parameter = interaction.options.getString('type');

        const helper = new TicketService(client);

        if (parameter !== "list" && parameter !== "clear") {
            const role = interaction.options.getRole('role');

            if (!role) return interaction.fail('ℹ️ | You didn`t specify a role');

            if (role.position >= guild.members.me.roles.highest.position) return interaction.fail('ℹ️ | This role is above or equal to mine');

            if (role.managed === true) return interaction.fail('ℹ️ | Only user roles can be added');

            const data = await DatabaseHelper.findSupportRole({ guildId, role });

            if (parameter == "add") {
                if (!data) {
                    DatabaseHelper.editSupportRole({ guildId, role, type: 0 });
                    interaction.guild.cache.supportRole.push(role.id);

                    const embed = helper._buildEmbed('Green', 'Successfully', false, 'You have successfully added a new support agent role', false, false, true);
                    return await interaction.reply({ embeds: [embed] }).catch(() => {});
                } else {
                    return interaction.fail('ℹ️ | This role is already assigned as a support agent');
                }
            } else if (parameter == "remove") {
                if (!data) {
                    return interaction.fail('ℹ️ | This role is not assigned as a support agent role');
                } else {
                    DatabaseHelper.editSupportRole({ guildId, role, type: 1 });
                    interaction.guild.cache.supportRole.pull(role.id);

                    const embed = helper._buildEmbed('Green', 'Successfully', false, 'You have successfully deleted the support agent role', false, false, true);
                    return await interaction.reply({ embeds: [embed] }).catch(() => {});
                }
            }
        } else if (parameter === "list") {
            const listRoles = interaction.guild.cache.supportRole;
            const support_roles = guild.roles.cache.filter(r => listRoles.includes(r.id));
            const roles = checkSupportRole(support_roles);

            if (roles.length == 0) return interaction.fail('ℹ️ | The list of support agent roles is empty');

            const embed = helper._buildEmbed('Blue', `List of support agent roles: ${roles.length}`, false, `${roles}`, false, false, true);
            return await interaction.reply({ embeds: [embed] }).catch(() => {});
        } else if (parameter === "clear") {
            const roles = interaction.guild.cache.supportRole;

            if (roles.length == 0) return interaction.fail('ℹ️ | The list of support agent roles is empty');

            DatabaseHelper.editSupportRole({ guildId, roles, type: 2 });
            interaction.guild.cache.supportRole.length = 0;

            const embed = helper._buildEmbed('Green', 'Successfully', false, 'You have successfully cleared the support agent roles', false, false, true);
            return await interaction.reply({ embeds: [embed] }).catch(() => {});
        }
    }
}

module.exports = SupportRoleCommand;