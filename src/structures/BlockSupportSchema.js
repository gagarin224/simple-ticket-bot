const { Schema, model } = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const schema = Schema({
    userId: reqString,
    guildId: reqString,
    reason: reqString,
    staffId: reqString,
    expires: {
        type: Date,
        required: true,
    },
    current: {
        type: Boolean,
        required: true,
    }
});

module.exports = model('blocksupports', schema);