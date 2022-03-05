import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong')
        .setDefaultPermission(false),
    async execute(interaction) {
        interaction.reply('Ping!');
    }
};