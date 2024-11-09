const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
require("dotenv").config();
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "../commands");
const commandFolders = fs
  .readdirSync(foldersPath)
  .filter((folder) => folder != ".DS_Store");

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js") && file != ".DS_Store");
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "../handlers");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.once(Events.ClientReady, () => {
  console.log("Ready!");
  client.user.setActivity(
    `${client.guilds.cache.size} guilds and ${client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    )} members`,
    {
      type: ActivityType.Watching,
    }
  );
  client.user.setStatus("dnd");
  console.log("Status set");
});

mongoose
  .connect(process.env.MONGODB_SRV)
  .then(() => console.log("DB Connected"));
client.login(process.env.token);
//https://sourceb.in/wK3wAGnTP7
