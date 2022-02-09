const { Client, CommandInteraction } = require("discord.js");
const mongoose = require("mongoose");
const settings = require("../../models/settings");

module.exports = {
  name: "setup",
  description: "Set the channel on which the game is played.",
  options: [
    {
      type: 7,
      name: "game-channel",
      description: "Set a game channel",
      required: true,
    },
    {
      type: 8,
      name: "gamerole",
      description: "game role",
      required: true,
    },
    {
      type: 8,
      name: "modrole",
      description: "mod role",
      required: true,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

  run: async (client, interaction, args) => {
    const whoDidCmd = interaction.member
    const game = interaction.options.getChannel("game-channel");
    const gameRole = interaction.options.getRole("gamerole");
    const modRole = interaction.options.getRole("modrole");
    const guildId = interaction.guild.id;
    const dataSettings = await settings.findOne({ 'guildId': guildId });


    const data = await settings.findOne({ guildId: guildId });
    if (!data) {
      new settings({
        guildId: guildId,
        configured: true,
        roleId: gameRole.id,
        allowRoleId: modRole.id,
        gameId: game.id,
        statement: "red",
        gameStatus: false,
        maxPlayers: 0,
      }).save();
    } else {
      if (!whoDidCmd._roles.includes(dataSettings.allowRoleId != "" || dataSettings.allowRoleId)) {
        interaction.deferReply({ ephemeral: true });
        interaction.followUp({
          content: `You dont have the perms`,
        });
        return
      }
      data.delete()
      new settings({
        guildId: guildId,
        configured: true,
        roleId: gameRole.id,
        allowRoleId: modRole.id,
        gameId: game.id,
        statement: "red",
        gameStatus: false,
        maxPlayers: 0,
      }).save();
    }

    console.log(`Settings has been updated`);
    interaction.deferReply({ ephemeral: true });
    interaction.followUp({
      content: `You selected the <#${game.id}> channel, game will take place in this channel.\nYou selected the <@&${gameRole.id}> role for players.\nYou selected the <@&${modRole.id}> role for moderator.`,
    });
  },
};
