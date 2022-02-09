const client = require("../index");
const mongoose = require("mongoose");
const settings = require("../models/settings");

client.on("ready", async () => {
    console.log(`[BOT] init: ${client.user.tag}`)
    const dataSettings = await settings.find();

    client.user.setActivity('people die', { type: 'WATCHING' });

    for (const i in dataSettings) {
        await settings.findOneAndUpdate({'guildId': dataSettings[i].guildId}, {'statement': "red", 'gameStatus': false})
    }
}
);
