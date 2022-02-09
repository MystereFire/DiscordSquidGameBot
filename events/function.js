const { MessageEmbed } = require('discord.js');
const mongoose = require("mongoose");
const settings = require("../models/settings");
const players = require("../models/players");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function init_game(client, reaction, user) {
  let guildId = reaction.message.guildId;
  const dataSettings = await settings.findOne({ 'guildId': guildId });
  const dataPlayers = await players.find({ 'guildId': guildId });
  const gameChannel = client.channels.cache.find(
    (channel) => channel.id === dataSettings.gameId
  );
  pcons("Starting game..");
  let roleId = dataSettings.roleId;
  pcons("")
  pcons('↓ ID OF ALL PLAYERS ↓')
  for (const i in dataPlayers) {
    pcons(dataPlayers[i].playerId);
  }
  gameChannel.send({ content: "Ready ?" })
  await sleep(1000);
  gameChannel.send({ content: "3" })
  await sleep(1000);
  gameChannel.send({ content: "2" })
  await sleep(1000);
  gameChannel.send({ content: "1" })
  await sleep(1000);
  gameChannel.permissionOverwrites.edit(roleId, { SEND_MESSAGES: true });
  second = 600
  time = second * 1000
  while (time > 0) {
    const greenEmbed = new MessageEmbed()
      .setTitle("🟢 GREEN LIGHT 🟢")
      .setColor('#00ff00')
    gameChannel.send({ embeds: [greenEmbed] })
    await settings.findOneAndUpdate({ guildId: guildId }, { statement: "green", gameStatus: true });
    splay = Math.floor(Math.random() * 100) * 1000
    await sleep(splay)
    const redEmbed = new MessageEmbed()
      .setTitle("🔴 RED LIGHT 🔴")
      .setColor('#FF0000')
    gameChannel.send({ embeds: [redEmbed] })
    await settings.findOneAndUpdate({ guildId: guildId }, { statement: "red", gameStatus: true });
    await sleep(3000)
    time -= splay
  }
  gameChannel.permissionOverwrites.edit(dataSettings.roleId, { SEND_MESSAGES: false });
  const soloWin = await players.find({ guildId: guildId })
  const cntPlr = soloWin.length
  soloWin.sort((a, b) => b.points - a.points)
  if (cntPlr == 1) {
    const endEmbed = new MessageEmbed()
      .setTitle("🕹️ GAME FINISH 🕹️")
      .setColor('#0000FF')
      .setDescription("The Game is over, to restart the game /start-game")
      .addField("🥇", `<@${soloWin[0].playerId}> With ${soloWin[0].points} points`)
      .setFooter("Dev By MystereFire#7241, ")
    gameChannel.send({ embeds: [endEmbed] })
  } else if (cntPlr == 2) {
    const endEmbed = new MessageEmbed()
      .setTitle("🕹️ GAME FINISH 🕹️")
      .setColor('#0000FF')
      .setDescription("The Game is over, to restart the game /start-game")
      .addField("🥇", `<@${soloWin[0].playerId}> With ${soloWin[0].points} points`)
      .addField("🥈", `<@${soloWin[1].playerId}> With ${soloWin[1].points} points`)
      .setFooter("Dev By MystereFire#7241, ")
    gameChannel.send({ embeds: [endEmbed] })
  } else if (cntPlr > 2) {
    const endEmbed = new MessageEmbed()
      .setTitle("🕹️ GAME FINISH 🕹️")
      .setColor('#0000FF')
      .setDescription("The Game is over, to restart the game /start-game")
      .addField("🥇", `<@${soloWin[0].playerId}> With ${soloWin[0].points} points`)
      .addField("🥈", `<@${soloWin[1].playerId}> With ${soloWin[1].points} points`)
      .addField("🥉", `<@${soloWin[2].playerId}> With ${soloWin[2].points} points`)
      .setFooter("Dev By MystereFire#7241, ")
    gameChannel.send({ embeds: [endEmbed] })
  }
  await settings.findOneAndUpdate({ guildId: guildId }, { statement: "red", gameStatus: false });  
}


function pcons(args) {
  console.log("[SQUID GAME] " + args);
}

module.exports.init_game = init_game
module.exports.pcons = pcons
