class SimpleTicketCommand {
    constructor(name, options = {}, cooldown = 5) {
        this.name = name;
        this.description = options.description || null;
        this.raw = {
            name,
            ...options,
            dm_permission: false
        }
        this.cooldown = cooldown;
    }
}

module.exports = SimpleTicketCommand;