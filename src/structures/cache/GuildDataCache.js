class GuildDataCache {
    constructor(data = null) {
        this.supportChannel = data?.support?.supportChannel ?? null
        this.notificationChannel = data?.support?.notificationChannel ?? null
        this.numberTicket = data?.support?.numberTicket ?? 0
        this.activeCategory = data?.support?.activeCategory ?? null
        this.holdCategory = data?.support?.holdCategory ?? null
        this.closeCategory = data?.support?.closeCategory ?? null
        this.supportRole = data?.support?.supportRole ?? Array
        this.timeTicketDelete = data?.support?.timeTicketDelete ?? 86400000
        this.messageId = data?.embed?.messageId ?? null
        this.color = data?.embed?.color ?? null
        this.title = data?.embed?.title ?? null
        this.description = data?.embed?.description ?? null
        this.image = data?.embed?.image ?? null
    }

    set(prop, val) {
        return this[prop] = val;
    }
    
    push(arr, el) {
        if (!Array.isArray(this[arr])) throw new TypeError(`You can add data using the push method only to an array`);
        return this[arr].push(el);
    }
}

module.exports = GuildDataCache;