const { PermissionsBitField, ChannelType } = require('discord.js');
const SimpleTicketCommand = require('../../structures/SimpleTicketCommand');
const { checkUserPermissions, findMessage } = require('../../utils/Functions');
const TicketService = require('../../services/TicketService');
const DatabaseHelper = require('../../helpers/DatabaseHelper');

class SetEmbedCommand extends SimpleTicketCommand {
    constructor() {
        super('setembed', {
            description: 'Set support embed settings',
            options: [
                {
                    name: 'type',
                    description: 'Select which parameter you want to set',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Set a support message',
                            value: 'messageId'
                        },
                        {
                            name: 'Set a color for support embed',
                            value: 'color'
                        },
                        {
                            name: 'Set a title for support embed',
                            value: 'title'
                        },
                        {
                            name: 'Set a description for support embed',
                            value: 'description'
                        },
                        {
                            name: 'Set a image for support embed',
                            value: 'image'
                        },
                    ]
                },
                {
                    name: 'value',
                    description: 'Provide the value (id/color/title etc.)',
                    type: 3,
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
        const value = interaction.options.getString('value');

        if (!checkUserPermissions(commandMember, PermissionsBitField.Flags.ManageGuild)) return interaction.fail('ℹ️ | You don`t have the right to \`ManageGuild\`.');

        if (type === "messageId") {
            const data = findMessage(guild, value);

            if (!data) return interaction.fail('ℹ️ | Message with this ID is not found!');
        } else if (type === "color") {
            if (!value.startsWith("#")) return interaction.fail('ℹ️ | Color must have with a hashtag. Example: #FFFFFF - white color');
            if (value.length > 30) return interaction.fail('ℹ️ | Color length cannot exceed 30 characters');
        } else if (type === "title") {
            if (value.length > 100) return interaction.fail('ℹ️ | You have don`t provide title longer than 100 characters');
        } else if (type === "description") {
            if (value.length > 1700) return interaction.fail('ℹ️ | The description cannot be longer than 1700 characters');
        } else if (type === "image") {
            if (value.length > 250) return interaction.fail('ℹ️ | The link cannot be more than 250 characters long!');
        }

        const helper = new TicketService(client);
        
        const embed = helper._buildEmbed('Green', 'Successfull', false,
        `you have successfully edit a \`${type}\` embed to \`${value}\``,
        false, false, true);

        DatabaseHelper.updateEmbed({ guildId, type, value });
        interaction.guild.cache[type] = value;

        return await interaction.reply({ embeds: [embed] }).catch(() => {});
    }
}

module.exports = SetEmbedCommand;