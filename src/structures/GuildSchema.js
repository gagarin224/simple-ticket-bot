const { Schema, model } = require('mongoose');

const schema = Schema({
    guildId: String,
    support: {
        supportChannel: String,
        notificationChannel: String,
        numberTicket: { type: Number, default: 0 },
        activeCategory: String,
        holdCategory: String,
        closeCategory: String,
        supportRole: [String],
        timeTicketDelete: { type: Number, default: 86400000 }
    },
    embed: {
        messageId: String,
        color: String,
        title: String,
        description: String,
        image: String
    }
});

module.exports = model('guilds', schema);