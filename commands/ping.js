import { SlashCommandBuilder } from "@discordjs/builders";

export const command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong'),
    async execute(interaction) {
        interaction.reply('Ping!');
    }
};