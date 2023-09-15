const { Message, CommandInteraction, ButtonInteraction, EmbedBuilder } = require('discord.js');

CommandInteraction.prototype.fail = function failMessage(content, ephemeral = false) {
    return this.reply({
        embeds: [
            new EmbedBuilder()
            .setTitle(`❌ | Error`)
            .setDescription(content)
            .setColor(0xff3333)
            .setFooter({ text: this.client.user.username, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
        ],
        ephemeral
    });
}

ButtonInteraction.prototype.fail = function failMessage(content, ephemeral = false) {
    return this.reply({
        embeds: [
            new EmbedBuilder()
            .setTitle(`❌ | Error`)
            .setDescription(content)
            .setColor(0xff3333)
            .setFooter({ text: this.client.user.username, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
        ],
        ephemeral
    });
}

ButtonInteraction.prototype.send = function(data) {
    this.channel.send(data);
}

Message.prototype.fail = function failMessage(content, ephemeral = true) {
    return this.reply({
        embeds: [
            new EmbedBuilder()
            .setTitle(`❌ | Error`)
            .setDescription(content)
            .setColor(0xff3333)
            .setFooter({ text: this.client.user.username, iconURL: this.client.user.avatarURL() })
            .setTimestamp()
        ],
        ephemeral
    });
}