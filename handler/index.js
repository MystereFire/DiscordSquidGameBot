const { glob } = require("glob");
const mongoose = require("mongoose")
const { promisify } = require("util");
const { Client } = require("discord.js");
const globPromise = promisify(glob);
const { guildId, allowMultiGuild } = require("../config.json");
const { pcons } = require("../events/function");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/commands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        if (allowMultiGuild) {
            await client.application.commands.set(arrayOfSlashCommands);
        } else {
            await client.guilds.cache.get(guildId).commands.set(arrayOfSlashCommands);
        }
    });

    // Mongoose handler
    const { mongooseConnectionString } = require('../config.json')
    if (!mongooseConnectionString) return;
    mongoose.connect(mongooseConnectionString).then(() => console.log('[BOT] init: Mongoose connected'));
};
