const client = require("../index");
const { MessageEmbed } = require('discord.js');
const mongoose = require("mongoose");
const settings = require("../models/settings");
const players = require("../models/players");
const datas = require("../models/datas");
const { pcons } = require("./function");


client.on('messageCreate', async (message) => {
	const guildId = message.guild.id
	const dataSettings = await settings.findOne({ 'guildId': guildId });
	const data = await settings.findOne({guildId: guildId});
    if (!data) {return}
	const dataDatas = await datas.findOne({ 'guildId': guildId, 'playerId': message.author.id });
	const dataPlayers = await players.findOne({ 'guildId': guildId, 'playerId': message.author.id });
	const channelId = dataSettings.gameId
	const gameStatus = dataSettings.gameStatus
	const statement = dataSettings.statement
	const gameChannel = client.channels.cache.find(
		(channel) => channel.id === dataSettings.gameId
	);
	let role = dataSettings.roleId
	if (message.channelId != channelId) { return }
	if (message.author.id == client.user.id) { return }
	if (gameStatus == false) { return }
	if (!await players.findOne({playerId: message.author.id})) {
		message.delete();
		return
	}
	let points = dataPlayers.points
	if (statement == "red") {
		message.member.roles.remove(role)
		message.delete()
		const deadEmbed = new MessageEmbed()
			.setTitle("☠️ DEAD ☠️")
			.setDescription(`${message.author.username} was kill with ${points} points`)
			.setColor('#FF0000')
		gameChannel.send({ embeds: [deadEmbed] })
		const data = await datas.findOne({ 'guildId': guildId, 'playerId': message.author.id });
		if (!data) {
			new datas({
				guildId: guildId,
				playerId: message.author.id,
				points: points,
				gamePlayed: 0,
				gameWin: 0
			}).save();
		} else {
			points = points + dataDatas.points
			await datas.findOneAndUpdate({ 'guildId': guildId, 'playerId': message.author.id }, { 'points': points })
			await players.deleteOne({ 'guildId': guildId, 'playerId': message.author.id });
		}
	}
	if (statement == "green") {
		points++
		await players.findOneAndUpdate({ 'guildId': guildId, 'playerId': message.author.id }, { 'points': points })
	}

});