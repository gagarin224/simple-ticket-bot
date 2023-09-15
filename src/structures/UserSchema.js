const { Schema, model } = require('mongoose');

const schema = Schema({
    guildId: String,
    userId: String,
    support: {
        holdTicket: { type: Number, default: 0 },
        one_rep: { type: Number, default: 0 },
        two_rep: { type: Number, default: 0 },
        three_rep: { type: Number, default: 0 },
        four_rep: { type: Number, default: 0 },
        five_rep: { type: Number, default: 0 },
    }
});

module.exports = model('users', schema);