const User = require('../../structures/UserSchema');
const DatabaseHelper = require('../../helpers/DatabaseHelper');
const SimpleTicketCommand = require('../../structures/SimpleTicketCommand');
const { checkUserSupportRole, checkUserPermissions, average } = require('../../utils/Functions');
const UserDataCache = require('../../structures/cache/UserDataCache');
const TicketService = require('../../services/TicketService');

class MyinfoCommand extends SimpleTicketCommand {
    constructor() {
        super('myinfo', {
            description: 'View moderator statistics',
            options: [
                {
                    name: 'user',
                    description: 'Specify the moderator whose statistics you want to view',
                    type: 6,
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
        const moderator_roles = guild.roles.cache.filter(r => supportRole.includes(r.id));

        if (!checkUserSupportRole(ticketMember, moderator_roles) && !checkUserPermissions(ticketMember, PermissionsBitField.Flags.ManageRoles)) return interaction.fail('ℹ️ | You are not a support agent/you do not have the right to \`ManageRoles\`.');
        
        const helper = new TicketService(client);

        if (!interaction_user) {
            const { holdTicket, one_rep, two_rep, three_rep, four_rep, five_rep } = interaction.user.cache;

            const embed = helper._buildEmbed('#FF0000', `Statistics: \`${commandMember.displayName}\``, guild, 
            `**[🤖] Number of tickets: **\`${holdTicket}\`` +
            `\n**[1️⃣] Number of ratings **\`${one_rep}\`` +
            `\n**[2️⃣] Number of ratings **\`${two_rep}\`` +
            `\n**[3️⃣] Number of ratings **\`${three_rep}\`` +
            `\n**[4️⃣] Number of ratings** \`${four_rep}\`` +
            `\n**[5️⃣] Number of ratings** \`${five_rep}\`` +
            `\n**[📊] Average score:** \`${average([one_rep,two_rep,three_rep,four_rep,five_rep])}\``,
            commandMember.user, false, true)
            await interaction.reply({ embeds: [embed] }).catch(() => {});
        } else {
            const member = client.users.cache.get(interaction_user.id);
            if (!member?.cache) {
                const data = await User.findOne({ guildId, userId: member.id });
                if (!data) DatabaseHelper.createUserEntry({ guildId, userId: member.id });
            
                client.users.cache.get(member.id).cache = new UserDataCache(data);
            }

            const { holdTicket, one_rep, two_rep, three_rep, four_rep, five_rep } = member.cache;

            const embed = helper._buildEmbed('#FF0000', `Statistics: \`${member.displayName}\``, guild, 
            `**[🤖] Number of tickets: **\`${holdTicket}\`` +
            `\n**[1️⃣] Number of ratings **\`${one_rep}\`` +
            `\n**[2️⃣] Number of ratings **\`${two_rep}\`` +
            `\n**[3️⃣] Number of ratings **\`${three_rep}\`` +
            `\n**[4️⃣] Number of ratings** \`${four_rep}\`` +
            `\n**[5️⃣] Number of ratings** \`${five_rep}\`` +
            `\n**[📊] Average score:** \`${average([one_rep,two_rep,three_rep,four_rep,five_rep])}\``,
            member, false, true)
            await interaction.reply({ embeds: [embed] }).catch(() => {});
        }
    }
}

module.exports = MyinfoCommand;