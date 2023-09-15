class UserDataCache {
    constructor(data = null) {
        this.holdTicket = data?.support?.holdTicket ?? 0
        this.one_rep = data?.support?.one_rep ?? 0
        this.two_rep = data?.support?.two_rep ?? 0
        this.three_rep = data?.support?.three_rep ?? 0
        this.four_rep = data?.support?.four_rep ?? 0
        this.five_rep = data?.support?.five_rep ?? 0
    }

    set(prop, val) {
        return this[prop] = val;
    }
    
    push(arr, el) {
        if (!Array.isArray(this[arr])) throw new TypeError(`You can add data using the push method only to an array`);
        return this[arr].push(el);
    }
}

module.exports = UserDataCache;