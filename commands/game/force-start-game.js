const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const settings = require("../../models/settings");
const players = require("../../models/players");
const { pcons } = require("../../events/function");

module.exports = {
    name: "force-start-game",
    description: "Start Red-Light/Green-Light game from Squid Game.",
    type: "CHAT_INPUT",

    options: [
        {
            name: "participants",
            description: "Select the amount of participants.",
            type: "INTEGER",
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
        const guildId = interaction.guild.id;
        const dataSettings = await settings.findOne({ 'guildId': guildId });
        if (!dataSettings.configured) {
            interaction.deferReply({ ephemeral: false });
            interaction.followUp({
                content: `No settings detected, please setup settings by using \`\`/setup \`\`.`,
            });
            return
        }
        if (!whoDidCmd._roles.includes(dataSettings.allowRoleId)) {
            interaction.deferReply({ ephemeral: true });
            interaction.followUp({
              content: `You dont have the perms`,
            });
            return
          }
        const maxparticipants = interaction.options.getInteger("participants");
        await settings.findOneAndUpdate({ guildId: guildId }, { maxPlayers: maxparticipants });
        const dataPlayers = await players.find({ 'guildId': guildId });
        for (const i in dataPlayers) {
          pcons(dataPlayers[i].remove());
        }
        
        pcons("")
        pcons("NEW GAME STARTED");
        pcons("PARTICIPANTS LIST CLEARED.\n")

        const embedReaction = new MessageEmbed()
            .setTitle("NEW RED/GREEN LIGHT SESSION")
            .setColor("RANDOM")
            .setDescription(
                `
                        This game is based on the Netflix' series: Squid Game. \n\nThe bot will say "Green Light ????" and after that you can start writing some words or sentences.
                        \nAfter a few minutes, the bot will say "Red Light ????", every one of you talking after this will be eliminated.       
                    `
            )
            .addField("Host", `${interaction.user.tag}`, true)
            .addField("Participants", `${maxparticipants}`, true)
            .addField("Points", `1 point per word`, true)
            .setFooter("React to enter (don't forget to check rules before).")
            .setTimestamp();

        const gamechannel = client.channels.cache.find((channel) =>
            channel.id == dataSettings.gameId
        );
        gamechannel
            .send({ embeds: [embedReaction] })
            .then((gc) => {
                gc.react("????");
            })
            .catch(() => {
                console.log("error");
            });

        interaction.deferReply({ ephemeral: false });
        interaction.followUp({
            content: `Game started in ${gamechannel}. Waiting players.`,
        });

        // syst??me pour enlever tout le monde du roles participantId (nok)
        let roleId = dataSettings.roleId
        gamechannel.permissionOverwrites.edit(dataSettings.roleId, { SEND_MESSAGES: false });
        await interaction.member.guild.roles.cache
            .get(dataSettings.roleId)
            .members.map((member) => {
                member.roles.remove(dataSettings.roleId);
            });
    },
};
