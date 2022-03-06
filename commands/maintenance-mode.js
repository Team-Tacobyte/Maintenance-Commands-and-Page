import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('mt')
        .setDescription('Enable/Disable Maintenance Mode')
        .setDefaultPermission(false), // This means only the roles/user defined in .env can use it
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle('Maintenance Mode')
            .setDescription(`Do you wish to ${process.env.MT === 'true' ? 'disable' : 'enable' } maintenance mode?`)
        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('yes')
                    .setLabel('YES')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('no')
                    .setLabel('NO')
                    .setStyle('DANGER'),
            )
        interaction.reply({ ephemeral: true, embeds: [embed], components: [buttons]});

        const filter = i => i.user.id === interaction.user.id;
        await interaction.channel.awaitMessageComponent({filter, time: 5000 })
        .then(async i => {
            if (i.customId === 'yes') {
                i.reply({ ephemeral: true, content: `${process.env.MT === 'true' ? 'Disabling' : 'Enabling' } Maintenance Mode` })
                process.env.MT = process.env.MT === 'true' ? 'false' : 'true';
            } else {
                i.reply({ ephemeral: true, content: 'Operation Cancelled' })
            }
        }).catch(err => {
            interaction.followUp({ ephemeral: true, content: 'You took too long to respond...', files: ['https://tenor.com/view/you-gotta-be-quicker-than-that-gif-24611709.gif'] });
        })
    }
};