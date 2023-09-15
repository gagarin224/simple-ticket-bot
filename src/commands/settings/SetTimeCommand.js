const { PermissionsBitField } = require('discord.js');
const ms = require('ms');
const SimpleTicketCommand = require('../../structures/SimpleTicketCommand');
const { checkUserPermissions } = require('../../utils/Functions');
const TicketService = require('../../services/TicketService');
const DatabaseHelper = require('../../helpers/DatabaseHelper');

class SetTimeCommand extends SimpleTicketCommand {
    constructor() {
        super('settime', {
            description: 'Set the time to delete tickets',
            options: [
                {
                    name: 'value',
                    description: 'Specify the time (example: 1h or 1d)',
                    type: 3,
                    required: true,
                }
            ]
        });
    }

    async run(client, interaction) {
        const { guildId, user } = interaction;
        const guild = client.guilds.cache.get(guildId);
        const commandMember = await guild.members.fetch(user.id).catch(() => {});
        const value = interaction.options.getString('value');

        const seconds = parseInt(value);
        const minutes = parseInt(value);
        const hours = parseInt(value);
        const days = parseInt(value);

        if (!checkUserPermissions(commandMember, PermissionsBitField.Flags.ManageGuild)) return interaction.fail('ℹ️ | You don`t have the right `Manage guild`');

        if (value === "Infinity") return interaction.fail('ℹ️ | You specified a forbidden argument');

        if (value.includes(`${seconds}s`) && (parseInt(value) < 3600 || parseInt(value) > 86400)) return interaction.fail('ℹ️ | The specified time should not be less than 1 hour and not more than 1 day');
        if (value.includes(`${minutes}m`) && (parseInt(value) < 60 || parseInt(value) > 1440)) return interaction.fail('ℹ️ | The specified time should not be less than 1 hour and not more than 1 day');
        if (value.includes(`${hours}m`) && (parseInt(value) < 1 || parseInt(value) > 24)) return interaction.fail('ℹ️ | The specified time should not be less than 1 hour and not more than 1 day');
        if (value.includes(`${days}m`) && (parseInt(value) < 1 || parseInt(value) > 1)) return interaction.fail('ℹ️ | The specified time should not be less than 1 hour and not more than 1 day');

        const duration = ms(value);
        if (!duration) return interaction.fail('ℹ️ | You must specify the exact time. Example: 1h or 1d');

        if (duration == interaction.guild.cache.timeTicketDelete) return interaction.fail('ℹ️ | You gave an identical time');

        const helper = new TicketService(client);

        const embed = helper._buildEmbed('Green', 'Successfull', false,
        `You have successfully changed the time to delete tickets to \`${value}\``,
        false, false, true);

        DatabaseHelper.updateTimeTicketDelete({ guildId, duration });
        interaction.guild.cache.timeTicketDelete = duration;

        return await interaction.reply({ embeds: [embed] }).catch(() => {});
    }
}

module.exports = SetTimeCommand;