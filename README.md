# Please Read Me!

The following mark-down file explains the key concepts in the code (for usage **and** editing)

# Setup

## Dependencies

The programs dependencies are not in the github, you will have to run the following to download them:
```
npm install
```

## Environment Variables

The script uses a module called **dotenv**, you will need to create a file in the working directory called **.env** and place the following inside it:

```
D_TOKEN="<bots_token>"
PORT="<http_port>"
ACCESS_ROLE_ID_ARRAY=["<some_role_ids>", "<to_be>", "<elevated>"]
OVERLORD_ID="id_of_highest_admin"
STATS_CHANNEL="id_of_stats_channel"
```
> **Note:** You can also declare environment variables on execution, but this is **not** reccemended

## Execution

To runt the script, simply go to the working directory using a terminal of preference and run `node .`

# Commands

## Declaration


>**Note:** New commands will take an hour to register on the discord API, editing them is not affected

Commands are seperated into **.js** files in the **commands** directory.
They use the **SlashCommandBuilder** from the **@discordjs/builders** package, an example implementation would be:

```js
import { SlashCommandBuilder } from  "@discordjs/builders";
export  const  command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong'),
	async  execute(interaction) {
		interaction.reply('Ping!');
	}
};
```

## Elevated

Elevated commands can only be ran by the **overlord** or anybody with a role that is elevated.
To mark a command as an elevated command, simply add `.setDefaultPermission(false)` to the **SlashCommandBuilder** class instance, for example:

```js
new  SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with pong')
	.setDefaultPermission(false)
```