const client = require("../index");
const mongoose = require("mongoose");
const settings = require("../models/settings");
const players = require("../models/players");
const { pcons, init_game } = require("./function");

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction._emoji.name != "👋") return;
  let guildId = reaction.message.guildId;
  const dataSettings = await settings.findOne({ guildId: guildId });
  
  if (dataSettings.gameId == "") return;
  if (user == client.user.id) return;
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      return;
    }
  }
  if (reaction.message.channelId != dataSettings.gameId) return;
  let role = dataSettings.roleId;
  await players.deleteOne({ guildId: guildId, playerId: user.id });
  console.log(`[SQUID GAME] PLAYER LEFT: ${user.tag} (${user.id})`);
  let guild = client.guilds.cache.get(reaction.message.guildId);
  let member = guild.members.cache.get(user.id);
  member.roles.remove(role);
});
