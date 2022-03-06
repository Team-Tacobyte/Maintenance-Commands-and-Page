// https://discord.js.org/
// Framework for the Discord API side of the server
import { Client, Intents, Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

// Built in file-system module
import { readdirSync, stat } from "fs";
import { get_stats } from "./server-stats.js";

// Import and setup command variables
const commands = [];
client.commands = new Collection();
(async () => {
    for (const file of readdirSync('./commands')) {
        const { command } = await import(`./commands/${file}`);
        commands.push(command.data.toJSON()); // For sending to discord for slash commands
        client.commands.set(command.data.name, command); // For executing on our side
    }
})()

// Triggered only once when the client is ready
client.once('ready', async () => {
    let stats_msg = await client.channels.cache.get(process.env.STATS_CHANNEL).send(await get_stats())
    setInterval(async() => {stats_msg.edit({ content: await get_stats()})}, 5000)
    console.log('Stats Mechanism Started')
    const CLIENT_ID = client.user.id;
    const rest = new REST({ version: '9' }).setToken(process.env.D_TOKEN);

    await (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(CLIENT_ID), { body: commands },
            );
            console.log('Successfully refreshed application (/) commands.');
            console.log('Assigning Designated Permissions.')
            for (const guild of (await client.guilds.fetch())) {
                const permissions = []
                permissions.push({
                    id: process.env.OVERLORD_ID,
                    type: 'USER',
                    permission: true,
                });
                JSON.parse(process.env.ACCESS_ROLE_ID_ARRAY).forEach(role_id => {
                    permissions.push({
                        id: role_id,
                        type: 'ROLE',
                        permission: true,
                    });
                });
                
                for (const [key, value] of (await client.application?.commands.fetch()).entries()) {
                    if (value.defaultPermission != undefined && !value.defaultPermission) {
                        await client.application?.commands.permissions.set({
                            guild: guild[1].id,
                            command: value.id,
                            permissions
                        })
                    }
                }
            };
            console.log("Designated Permissions Set.")
        } catch (error) {
            console.error(error);
        }
    })();

    console.log(`Invite Link: https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=applications.commands%20bot&permissions=8`)
});

// Everytime the bot is interacted with
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return; // Make sure its a command
    const command = client.commands.get(interaction.commandName)
    command.execute(interaction);
});

// Whenever it joins a guild, mainly load the permissions
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);

    (async() => {
        console.log('Assigning Guild Permissions.')
        const permissions = []
        permissions.push({
            id: process.env.OVERLORD_ID,
            type: 'USER',
            permission: true,
        });
        JSON.parse(process.env.ACCESS_ROLE_ID_ARRAY).forEach(role_id => {
            permissions.push({
                id: role_id,
                type: 'ROLE',
                permission: true,
            });
        });
        
        for (const [key, value] of (await client.application?.commands.fetch()).entries()) {
            if (value.defaultPermission != undefined && !value.defaultPermission) {
                await client.application?.commands.permissions.set({
                    guild: guild.id,
                    command: value.id,
                    permissions
                })
            }
        }
        console.log("Guild Permissions Set.")    
    })();

})

export const get_commands = async() => {
    let values = []
    for (const [key, value] of await client.commands.entries()) {values.push(value)}
    return values;
}

client.login(process.env.D_TOKEN);