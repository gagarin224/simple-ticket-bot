const { Schema, model } = require('mongoose');

const schema = Schema({
    guildId: String,
    userId: String,
    status: Number,
    numberTicket: Number,
    channelId: String,
    timeToDelete: Date,
    agentId: String
});

module.exports = model('tickets', schema);