const mongoose = require("mongoose");

module.exports = mongoose.model(
    "players",
    new mongoose.Schema({
        guildId: String,
        playerId: String,
        points: Number
    })
);