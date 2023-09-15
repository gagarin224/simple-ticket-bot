const Guild = require('../structures/GuildSchema');
const User = require('../structures/UserSchema');
const Ticket = require('../structures/TicketSchema');
const BlockSupport = require('../structures/BlockSupportSchema');

class DatabaseHelper {
    constructor() {
        throw new ReferenceError(`Class ${this.constructor.name} cannot be initialized!`);
    }

    static async createGuildEntry({ guildId }) {
        return await new Guild({ guildId }).save();
    }

    static async createUserEntry({ guildId, userId }) {
        return await new User({ guildId, userId }).save();
    }

    static async createBlockSupportEntry({ userId, guildId, reason, staffId, expires, current }) {
        return await new BlockSupport({ userId, guildId, reason, staffId, expires, current }).save();
    }

    static async findTicket({ guildId, channelId }) {
        return await Ticket.findOne({ guildId, channelId });
    }

    static async checkSupportBan({ userId, guildId }) {
        return await BlockSupport.findOne({ userId, guildId, current: true });
    }

    static async createTicketEntry({ guildId, userId, channelId, numberTicket, status = 0 }) {
        await new Ticket({ guildId, userId, status, channelId, numberTicket }).save();

        const filter = { guildId };
        const update = { $set: { 'support.numberTicket': numberTicket += 1 } };
        const options = { new: true };

        return await Guild.findOneAndUpdate(filter, update, options);
    }

    static async findTicketsEntrys({ guildId }) {
        const data = await Ticket.find({ guildId, status: { $in: [0, 1, 2] } });
        const dataActive = data.filter(ticket => ticket.status === 0).length;
        const dataHold = data.filter(ticket => ticket.status === 1).length;
        const dataClose = data.filter(ticket => ticket.status === 2).length;

        return [dataActive, dataHold, dataClose];
    }

    static async updateTicket({ guildId, userId, channelId, status }) {
        const data = await Ticket.findOne({ guildId, channelId });

        switch (status) {
            case 0:
                data.status = status;
                data.save();
                break;
        
            case 1:
                data.status = status;
                data.save();
                const user = await User.findOne({ guildId, userId });
                user.support.holdTicket += 1;
                user.save();
                break;
            default:
                break;
        }
    }

    static async updateRatingModerator({ guildId, userId, number }) {
        const data = await User.findOne({ guildId, userId });
        if (!data) return;

        switch (number) {
            case 1:
                data.support.one_rep += 1;
                return data.save();
        
            case 2:
                data.support.two_rep += 1;
                return data.save();

            case 3:
                data.support.three_rep += 1;
                return data.save();

            case 4:
                data.support.four_rep += 1;
                return data.save();

            case 5:
                data.support.five_rep += 1;
                return data.save();
        }
    }

    static async findSupportRole({ guildId, role }) {
        return await Guild.findOne({
            guildId,
            ['support.supportRole']: role.id
        });
    }

    static async editSupportRole({ guildId, role, type }) {
        switch (type) {
            case 0:
                return await Guild.findOneAndUpdate({
                    guildId
                }, {
                    $push: {
                        ['support.supportRole']: role.id
                    }
                });
            case 1:
                return await Guild.findOneAndUpdate({
                    guildId
                }, {
                    $pull: {
                        ['support.supportRole']: role.id
                    }
                });
            case 2:
                return await Guild.findOneAndUpdate({
                    guildId,
                }, {
                    $set: {
                        ['support.supportRole']: []
                    } 
                });
        }
    }

    static async updateSupportChannel({ guildId, type, channel }) {
        const updatedGuild = await Guild.findOneAndUpdate(
            { guildId },
            { $set: { [`support.${type}`]: channel.id } },
            { new: true }
        );

        return updatedGuild;
    }

    static async updateEmbed({ guildId, type, value }) {
        const updatedGuild = await Guild.findOneAndUpdate(
            { guildId },
            { $set: { [`embed.${type}`]: value } },
            { new: true }
        );

        return updatedGuild;
    }

    static async updateTimeTicketDelete({ guildId, duration }) {
        const updatedGuild = await Guild.findOneAndUpdate(
            { guildId },
            { $set: { ['support.timeTicketDelete']: duration } },
            { new: true }
        );

        return updatedGuild;
    }

    static async updateBlockSupportStatus({ userId, guildId }) {
        const updatedBlockSupport = await BlockSupport.findOneAndUpdate(
            { userId, guildId, current: true },
            { $set: { current: false } },
            { new: true }
        );

        return updatedBlockSupport;
    }
}

module.exports = DatabaseHelper;