const path = require('path');
const fs = require('fs').promises;

const SimpleTicketCommand = require('../structures/SimpleTicketCommand');
const SimpleTicketEvent = require('../structures/SimpleTicketEvent');

class LoaderService {
    constructor() {
        throw new ReferenceError(`Class ${this.constructor.name} cannot be initialized!`);
    }

    static async loadCommands(client, dir = '') {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if (stat.isDirectory()) {
                await this.loadCommands(client, path.join(dir, file));
            }
            if (file.endsWith('.js')) {
                const Command = require(path.join(filePath, file));
                if (Command.prototype instanceof SimpleTicketCommand) {
                    const cmd = new Command();
                    client.commands.set(cmd.name, cmd);
                }
            }
        }
    }

    static async loadEvents(client, dir = '') {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const stat = await fs.lstat(path.join(filePath, file));
            if (stat.isDirectory()) {
                await this.loadEvents(client, path.join(dir, file));
            }
            if (file.endsWith('.js')) {
                const Listener = require(path.join(filePath, file));
                if (Listener.prototype instanceof SimpleTicketEvent) {
                    const listener = new Listener();
                    client.events.set(listener.name, listener);
                    client.on(listener.name, listener.run.bind(listener, client));
                }
            }
        }
    }
}

module.exports = LoaderService;