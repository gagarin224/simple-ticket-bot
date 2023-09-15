const DatabaseHelper = require('../../helpers/DatabaseHelper');
const SimpleTicketButton = require('../../structures/SimpleTicketButton');
const TicketService = require('../../services/TicketService');
const User = require('../../structures/UserSchema');
const UserDataCache = require('../../structures/cache/UserDataCache');

class TicketFourButton extends SimpleTicketButton {
    constructor() {
        super('ticketFourButton');
    }

    async run(client, interaction) {
        const { guildId, user, message, channelId } = interaction;

        const guild = client.guilds.cache.get(guildId);
        const ticketMember = await guild.members.fetch(user.id).catch(() => {});

        const dataTicket = await DatabaseHelper.findTicket({ guildId, channelId });
        if (!dataTicket) return interaction.fail('ℹ️ | This ticket is not found in the database');

        if (ticketMember.id != dataTicket.userId) return interaction.reply({ content: `Only the ticket author can give a rating`, ephemeral: true }).catch(() => {});

        await DatabaseHelper.updateRatingModerator({ guildId, userId: dataTicket.agentId, number: 4 });

        const member = client.users.cache.get(dataTicket.agentId);
        if (!member?.cache) {
            const data = await User.findOne({ guildId, userId: member.id });
            if (!data) DatabaseHelper.createUserEntry({ guildId, userId: member.id });
        
            client.users.cache.get(member.id).cache = new UserDataCache(data);
        }

        member.cache.four_rep += 1;

        const helper = new TicketService(client);
        let ratingEmbed = helper._buildEmbed('Blue', 'Evaluation', false, 
        `${ticketMember}, You rated the support agent's performance at 4 out of 5 points`,
        false, `© Support Team by Swallow^^${client.user.avatarURL()}`, true);

        message.edit({ embeds: [ratingEmbed], components: [] }).catch(err => {});

        return await interaction.reply({ content: `Successful evaluation`, ephemeral: true }).catch(() => {});
    }
}

module.exports = TicketFourButton;