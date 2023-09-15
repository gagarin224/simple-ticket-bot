const { PermissionsBitField, ChannelType } = require('discord.js');
const SimpleTicketCommand = require('../../structures/SimpleTicketCommand');
const { checkUserPermissions } = require('../../utils/Functions');
const TicketService = require('../../services/TicketService');
const DatabaseHelper = require('../../helpers/DatabaseHelper');

class SetChannelCommand extends SimpleTicketCommand {
    constructor() {
        super('setchannel', {
            description: 'Set support channels/categories',
            options: [
                {
                    name: 'type',
                    description: 'Select which channel/category you want to set',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Set a support channel',
                            value: 'supportChannel'
                        },
                        {
                            name: 'Set a notification channel for tickets',
                            value: 'notificationChannel'
                        },
                        {
                            name: 'Set a category for active tickets',
                            value: 'activeCategory'
                        },
                        {
                            name: 'Set a category for pending tickets',
                            value: 'holdCategory'
                        },
                        {
                            name: 'Set a category for closed tickets',
                            value: 'closeCategory'
                        },
                    ]
                },
                {
                    name: 'channel',
                    description: 'Select the channel/category you want to set',
                    type: 7,
                    required: true
                },
            ]
        });
    }

    async run(client, interaction) {
        const { guildId, user } = interaction;

        const guild = client.guilds.cache.get(guildId);
        const commandMember = await guild.members.fetch(user.id).catch(() => {});
        const type = interaction.options.getString('type');
        const channel = interaction.options.getChannel('channel');

        if (!checkUserPermissions(commandMember, PermissionsBitField.Flags.ManageGuild)) return interaction.fail('ℹ️ | You don`t have the right to \`ManageGuild\`.');

        if (type === "supportChannel" || type === "notificationChannel") {
            if (channel.type != ChannelType.GuildText) return interaction.fail('ℹ️ | Only text channel can be set');
        } else {
            if (channel.type != ChannelType.GuildCategory) return interaction.fail('ℹ️ | Only category can be set');
        }

        if (channel.id === interaction.guild.cache[type]) return interaction.fail('ℹ️ | This channel has already been assigned');

        const helper = new TicketService(client);

        const embed = helper._buildEmbed('Green', 'Successfull', false,
        `you have successfully set a \`${type}\``,
        false, false, true);

        DatabaseHelper.updateSupportChannel({ guildId, type, channel });
        interaction.guild.cache[type] = channel.id;

        return await interaction.reply({ embeds: [embed] }).catch(() => {});
    }
}

module.exports = SetChannelCommand;