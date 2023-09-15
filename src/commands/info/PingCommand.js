const SimpleTicketCommand = require('../../structures/SimpleTicketCommand');

class PingCommand extends SimpleTicketCommand {
    constructor() {
        super('ping', {
            description: 'Displays the current Discord API response delay',
        });
    }

    async run(client, interaction) {
        return interaction.reply({
            content: `🏓 Pong! Current Discord API response latency: \`${interaction.client.ws.ping}ms\``
        });
    }
}

module.exports = PingCommand;