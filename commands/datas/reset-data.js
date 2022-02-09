const { Client, CommandInteraction } = require("discord.js");
const mongoose = require("mongoose");
const settings = require("../../models/settings");
const players = require("../../models/players");

module.exports = {
  name: "reset-data",
  description: "reset all datas of players",
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

  run: async (client, interaction, args) => {
    const guildId = interaction.guild.id;
    const whoDidCmd = interaction.member
    const dataSettings = await settings.findOne({ 'guildId': guildId });
    if (!whoDidCmd._roles.includes(dataSettings.allowRoleId)) {
      interaction.deferReply({ ephemeral: true });
      interaction.followUp({
        content: `You dont have the perms`,
      });
      return
    }
    const dataPlayers = await players.find({ 'guildId': guildId });
      for (const i in dataPlayers) {
        pcons(dataPlayers[i].remove());
      }

    interaction.deferReply({ ephemeral: true });
    interaction.followUp({
      content: `you have reset the Datas`,
    });
  },
};
