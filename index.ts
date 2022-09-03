import Discord from "discord.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getLeaderboard, getLeader } from "./utils/leaderboard";
import fs from "fs/promises";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN;

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
  ],
});

// Express Stuff
app.get("/", (_, res) => {
  res.send("Hi There");
});

app.get("/leaderboard", async (_, res) => {
  const data = await getLeaderboard();
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  client.login(TOKEN);
});

// Discord Stuff
const refreshPresence = async () => {
  const leader = await getLeader();
  const user = await client.users.fetch(leader.id);
  client.user?.setActivity(`${user.tag}: ${leader.points}`, {
    type: "WATCHING",
  });
};

client.on("ready", async () => {
  console.log(`Bot is ready`);

  refreshPresence();

  const guild = client.guilds.cache.get("982327785009864904");
  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application?.commands;
  }

  commands?.create({
    name: "submit",
    description: "Submit a new cop request.",
    options: [
      {
        name: "lore",
        description: "The lore behind your cop.",
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        required: true,
      },
      {
        name: "rating",
        description: "How much you want to rate the cop.",
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
        min_value: 1,
        max_value: 5,
        required: true,
      },
    ],
  });

  commands?.create({
    name: 'help',
    description: 'Shows the help menu',
  });
  
});

setInterval(refreshPresence, 300000);

async function getCommands() {
  let files = await fs.readdir("./commands");
  files = files.map((item) => item.split(".")[0]);
  let commands: any = {};

  for (const file of files) {
    let command = await import(`./commands/${file}`);
    commands[command.name] = command;
  }

  return commands;
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const commands = await getCommands();

  if (!commands[commandName]) {
    interaction.reply({ content: "Dont Got That Command", ephemeral: true });
    return;
  }

  commands[commandName].handler(interaction);
});
