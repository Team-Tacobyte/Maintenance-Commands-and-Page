import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { spawn } from "child_process";
export const command = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Reload the server')
        .setDefaultPermission(false),
    async execute(interaction) {
        spawn(process.argv[0], process.argv.slice(1), {
            env: { PROCESS_RESTARTING: 1 },
            stdio: 'ignore'
        }).unref();
        process.exit();
    }
};
