const { PermissionFlagsBits } = require('discord.js');

class ButtonExecutorService {
    constructor(interaction, client) {
        this.interaction = interaction;
        this.client = client || interaction.client;
    }

    async runButton() {
        if (this.interaction.user.bot) return;

        const button = this.client.buttons.get(this.interaction.customId);

        if (button) {
            if (!this.interaction.guild.members.me.permissionsIn(this.interaction.channel).has(PermissionFlagsBits.EmbedLinks)) return this.interaction.reply({ content: 'У меня нет права на встраивание ссылок, пожалуйста, выдайте мне его, чтобы я смог работать корректно!' });

            try {
                button.run(this.client, this.interaction);
            } catch(error) {
                console.error(error);
            }
        }
    }
}

module.exports = ButtonExecutorService;