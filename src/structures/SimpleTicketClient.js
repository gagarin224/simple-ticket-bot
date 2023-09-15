const { Client, Collection } = require('discord.js');
const LoaderService = require('../services/LoaderService');
const InteractionService = require('../services/InteractionService');

class SimpleTicketClient extends Client {
    constructor(options = {}) {
        super(options);

        this.config = require('../../config.json');
        this.mongoose = require('../services/Database');
        this.functions = require('../utils/Functions');
        this.iservice = new InteractionService(this);
        this.commands = new Collection();
        this.buttons = new Collection();
        this.events = new Collection();
    };

    async _launch() {
        await this.mongoose._connect(this.config.dataURL);
        await LoaderService.loadEvents(this, '../events').then(() => console.log(`[Events] Events successfully has been loaded.`));
        await LoaderService.loadCommands(this, '../commands').then(() => console.log(`[Commands] Commands successfully has been loaded.`));
        await this.iservice.loadButtons(this, '../buttons').then(() => console.log(`[Buttons] Buttons successfully has been loaded.`));
        await this.iservice.loadCommands().then(() => console.log(`[Commands] Slash commands successfully has been loaded.`));
        return this.login(this.config.token).catch(console.error);     
    }
};

module.exports = SimpleTicketClient;