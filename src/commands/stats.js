const fs = require('fs');
const { MessageEmbed } = require('discord.js');
// connect to db
const User = require('../models/user.js');
const mongoose = require('mongoose');


module.exports.run = async(client, message, args) => {

    // CONNECT TO DB AND FETCH USER
    mongoose.connect(process.env.mongo_connect);
    let user = await User.findOne({userID: message.author.id});
    let embedContent = (`Questions Asked: ${user.asked}
        \nCorrect Responses: ${user.correct}
        \nAccuracy: ${getPercentage(user.correct, user.asked)}%
    `);
    let emb = new MessageEmbed;
    emb.setDescription(embedContent);
    emb.setColor('#63d6ff');
    emb.setTitle(`Stats for ${message.author.username}`)
    emb.setImage(message.author.displayAvatarURL());
    emb.setFooter(`${message.author.tag}`)
    message.channel.send(emb); 
}


function getPercentage(correct, asked) {
    return (correct / asked * 100).toFixed(2);
}

