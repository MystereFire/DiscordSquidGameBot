const mongoose = require("mongoose");

module.exports = mongoose.model(
    "settings",
    new mongoose.Schema({
        guildId: Number,
        configured: Boolean,
        roleId: String,
        allowRoleId: String,
        gameId: String,
        statement: String,
        gameStatus: Boolean,
        maxPlayers: Number,
    })
);