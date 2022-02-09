const { Client, CommandInteraction } = require("discord.js");
const mongoose = require("mongoose");
const settings = require("../../models/settings");

module.exports = {
  name: "reset-config",
  description: "reset the config",
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
    const data = await settings.findOne({guildId: guildId});
    if (!data) {
    } else { 
      data.delete() 
      new settings({
        guildId: guildId,
        configured: false,
        roleId: "",
        allowRoleId: "",
        gameId: "",
        statement: "red",
        gameStatus: false,
        maxPlayers: 0,
      }).save();
    }

    interaction.deferReply({ ephemeral: true });
    interaction.followUp({
      content: `you have reset the Settings`,
    });
  },
};
