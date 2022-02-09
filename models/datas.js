const mongoose = require("mongoose");

module.exports = mongoose.model(
    "datas",
    new mongoose.Schema({
        guildId: String,
        playerId: String,
        points: Number,
        gamePlayed: Number,
        gameWin: Number
    })
);