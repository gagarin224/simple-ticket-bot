const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const SimpleTicketButton = require('../structures/SimpleTicketButton');

class InteractionService {
    constructor(client) {
        if (!client) throw new Error(`In the ${this.constructor.name} class, the client parameter was expected during initialisation`);
        this.client = client;
        this._rest = new REST({ version: '10' }).setToken(client.config.token);
    }

    async loadButtons(client, dir = '') {
        const filePath = path.join(__dirname, dir);
        await readdirSync(filePath)
        .forEach(async module => {
            const buttonFiles = await readdirSync(`${filePath}/${module}/`)
            .filter(file => file.endsWith('.js'));

            for (const file of buttonFiles) {
                const Button = require(`${dir}/${module}/${file}`);
                if (Button.prototype instanceof SimpleTicketButton) {
                    const btn = new Button();
                    client.buttons.set(btn.name, btn);
                }
            }  
        });
    }

    async loadCommands() {
        return this._rest.put(Routes.applicationCommands(this.client.config.applicationId), { body: this.client.commands.map(c => c.raw) })
        .catch(console.error);
    }
}

module.exports = InteractionService;