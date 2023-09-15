const SimpleTicketEvent = require('../structures/SimpleTicketEvent');
const TicketService = require('../services/TicketService');

class ReadyEvent extends SimpleTicketEvent {
    constructor() {
        super('ready');
    }

    async run(client) {
        console.log(`[Client] ${client.user.username} has been started!`);

        setInterval(() => {
            const ticket = new TicketService(client);

            ticket._ticketDelete(client);
            ticket._checkBlockSupport();
        }, 30000);
    }
}

module.exports = ReadyEvent;