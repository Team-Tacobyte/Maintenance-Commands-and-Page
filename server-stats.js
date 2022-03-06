import http from "http";
import os from "os";
import {spawn} from "child_process";
import { get_commands } from "./discord_bot.js";

http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
    resp.on('data', function(ip) {
        console.log("Server Running At: " + ip);
        process.env.IP = ip;
    });
});

let oldCPUTime = 0
let oldCPUIdle = 0
function getLoad(){
    let cpus = os.cpus()
    let totalTime = -oldCPUTime
    let totalIdle = -oldCPUIdle
    for(let i = 0; i < cpus.length; i++) {
        let cpu = cpus[i]
        for(let type in cpu.times) {
            totalTime += cpu.times[type];
            if(type == "idle"){
                totalIdle += cpu.times[type];
            }
        }
    }
    let CPUload = 100 - Math.round(totalIdle/totalTime*100)
    oldCPUTime = totalTime
    oldCPUIdle = totalIdle
    return {
        CPU:CPUload,
        cores:cpus.length,
        mem:100 - Math.round(os.freemem()/os.totalmem()*100)
    }       
}
let temp;
spawn('cat', ['/sys/class/thermal/thermal_zone0/temp']).stdout.on('data', function(data) {
        temp = data/1000;
});

// Colour indicators
const good = '🟩';
const middle = '🟨';
const bad = '🟥';

export const get_stats = async() => {
    let help = ',─────[𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦─𝗛𝗘𝗟𝗣]';
    (await get_commands()).forEach(command => {
        help += `\n| ${command.data.name}: ${command.data.description}`;
    });
    help += '\n\'';

    let info = getLoad();

// Reallllllllly bad code, plz ignore
    return `\`\`\`
,─────[𝗡𝗘𝗧𝗪𝗢𝗥𝗞]
| Server IP: ${process.env.IP}
| in: not available  out: not available
| Port: ${process.env.PORT}
|-->ping: not available rn
’
,─────[𝗛𝗔𝗥𝗗𝗪𝗔𝗥𝗘]
| UPTIME: ${Math.floor(process.uptime()/60/60)} hours, ${Math.floor(process.uptime()/60)} minutes
| ${info.CPU < 80 ? info.CPU < 50 ? good : middle : bad} CPU LOAD: ${info.CPU}%
| CPU CORES: ${info.cores}
| ${info.mem < 80 ? info.mem < 50 ? good : middle : bad} RAM LOAD: ${info.mem}%
| ${temp < 60 ? temp < 45 ? good : middle : bad} TEMPERATURE: ${temp}°C
’
,─────[𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘]
| user count: None
’
,─────[𝗦𝗘𝗥𝗩𝗜𝗖𝗘𝗦]
| ${process.env.MT === 'true' ? good : bad} maintenance mode: ${process.env.MT === 'true' ? 'active' : 'inactive'}, enabled
’
,─────[𝗡𝗢𝗧𝗘𝗦]
| None
’
${help}\`\`\``}