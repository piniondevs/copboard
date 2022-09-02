import Discord from "discord.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getLeaderboard, getLeader } from "./utils/leaderboard";

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
});

setInterval(refreshPresence, 60000);

client.on("messageCreate", (message) => {
  if (message.author.id === client.user?.id) return;
});
