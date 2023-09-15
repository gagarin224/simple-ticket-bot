module.exports = {
    findChannel(guild, channel) {
        return guild.channels.cache.find(c => c.name === channel) || guild.channels.cache.find(c => c.id === channel);
    },
    checkBotPermission(guild, permission) {
        return guild.members.me.permissions.has(permission);
    },
    checkSupportRole(m_roles) {
        return m_roles.sort((a, b) => b.position - a.position).map(role => role.toString());
    },
    checkUserSupportRole(member, roles) {
        return member.roles.cache.some(r => roles.some(role => role.id == r.id));
    },
    checkUserPermissions(member, permission) {
        return member.permissions.has(permission);
    },
    average([ one_rep, two_rep, three_rep, four_rep, five_rep ]) {
        const obj = { one_rep: 1, two_rep: 2, three_rep: 3, four_rep: 4, five_rep: 5 };
        const arr = [];
        Object.keys(obj).forEach((i) => {
            Array.from({ length: arguments[0][obj[i]-1] }, () => arr.push(obj[i]));
        });
        if (!arr.length) return '0';
        return (arr.reduce((a, b) => (a + b)) / arr.length).toFixed(2);
    },
    plural(array, n, insertNumber = false) {
        n = +n;
        const word = array[n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
        return insertNumber ? `${n} ${word}` : word;
    },
    timeConversion(plural, ms) {

        let seconds = (ms / 1000);

        let minutes = (ms / (1000 * 60));

        let hours = (ms / (1000 * 60 * 60));

        let days = (ms / (1000 * 60 * 60 * 24));

        if (seconds < 60) {
            return seconds + ` ${plural([`second`, `seconds`, `seconds`], seconds)}`;
        } else if (minutes < 60) {
            return minutes + ` ${plural([`minute`, `minutes`, `minutes`], minutes)}`;
        } else if (hours < 24) {
            return hours + ` ${plural([`hour`, `hours`, `hours`], hours)}`;
        } else {
            return days + ` ${plural([`day`, `days`, `days`], days)}`;
        }
    },
    findMessage(guild, messageId) {
        return guild.channels.cache.each(async (channel) => {
            try {
                const message = await channel.messages.fetch(messageId);
                if (message) return message;
            } catch (error) {
                return null;
            }
        });
    }
}