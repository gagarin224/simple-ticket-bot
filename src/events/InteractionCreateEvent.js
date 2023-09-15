const SimpleTicketEvent = require('../structures/SimpleTicketEvent');
const CommandExecutorService = require('../services/CommandExecutorService');
const ButtonExecutorService = require('../services/ButtonExecutorService');

class InteractionCreateEvent extends SimpleTicketEvent {
    constructor() {
        super('interactionCreate');
    }

    async run(client, interaction) {
        switch (interaction.type) {
            case 2: {
                const executor = new CommandExecutorService(interaction, client);
                return executor.runCommand();
            }
            case 3:
                const executor = new ButtonExecutorService(interaction, client);
                return executor.runButton();
        }
    }
}

module.exports = InteractionCreateEvent;