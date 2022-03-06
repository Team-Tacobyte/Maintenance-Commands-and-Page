const reload_check = () => {
    if (process.env.PROCESS_RESTARTING) {
        delete process.env.PROCESS_RESTARTING;
        // Give old process one second to shut down before continuing ...
        setTimeout(reload_check, 1000);
        return;
    }
}
reload_check();
// Just a friendly greeting :)
// And console decoration
const USER = process.env.USER ? process.env.USER : process.env.USERNAME;
if (USER) {
    console.log(`Thanks for waking me ${USER}!\nSetting up your personalized console...`)
    Object.keys(console).forEach(key => {
        let old = console[key]
        console[key] = function(data) {
            process.stdout.write(`\x1b[35m${USER}:\x1b[0m `);
            old(data)
        };
    })
    console.log('Personalized Console Loaded :)')
} else {
    console.log('Sorry, I Couldn\'t Personalize Your Console :(')
}

// https://github.com/motdotla/dotenv
// For sensitive data (passwords, usernames, tokens, etc) **NEEDS .env FILE**
// Set PORT, ACCESS_ROLE_ID_ARRAY, OVERLORD_ID, STATS_CHANNEL, and D_TOKEN values
import * as dotenv from "dotenv/config";


// Setup discord bot
import * as bot from "./discord_bot.js";

// Setup Express server
import * as server from "./http_server.js";

// Setup server stats
import * as stats from "./server-stats.js";