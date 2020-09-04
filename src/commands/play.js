const he = require('he');
const fetch = require('node-fetch');

// connect to db
const User = require('../models/user.js');
const mongoose = require('mongoose');

module.exports.run = async(client, message, args) => {
    // CHECK IF USER HAS PERMISSION TO PLAY
    if (!checkRoles(message.member)) return message.channel.send(`You have insufficient privileges for this command.`);
    
    // CONNECT TO DB AND FETCH USER
    mongoose.connect(process.env.mongo_connect);
    let user = await User.findOne({userID: message.author.id});

    // FETCH A RANDOM TRIVIA QUESTION
    const trivia = await fetch('https://opentdb.com/api.php?amount=1');
    const response = await trivia.json();

    // CHECK IF RESPONSE IS VALID
    if (!(response.response_code === 0)) return message.channel.send(`There was an error when attempting to fetch a question.`);

    // INCREMENT QUESTIONS ASKED FOR USER
    user.asked += 1;
    user.save();

    // DECODE HTML ENTITIES IN QUESTION FOR PROPER OUTPUT FORMATTING
    const question = he.decode(response.results[0].question);
    console.log(response.results[0].correct_answer);

    // TRUE OR FALSE QUESTION
    if (response.results[0].type === 'boolean') {
        const correct_letter = (response.results[0].correct_answer === 'True') ? '🇹' : '🇫';
        const filter = (reaction, user) => {
            return ['🇹', '🇫'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        message.channel.send(`${question} \n\nTrue or False?`).then(function (sentMsg) {
            sentMsg.react('🇹')
            sentMsg.react('🇫')
            sentMsg.awaitReactions(filter, {max: 1, time: 15000, errors: ['time']})
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === correct_letter) {
                        message.reply('answered correctly!').then(user.correct += 1).then(user.save());
                    } else {
                        message.reply('WRONG!');
                    }
                })
                .catch(collected => {
                    //console.log(`after a min, only ${collected.size} reactions`);
                    message.channel.send(`No correct response given in time. Correct answer was ${correct_letter}.`);
                });
        })
    
    // MULTIPLE CHOICE QUESTION
    } else {
        const answers = shuffleAnswers(response);
        const correct_letter = getAnswer(response, answers);
        const filter = (reaction, user) => {
            return ['🇦', '🇧', '🇨', '🇩'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        message.channel.send(`${question}\n\nA. ${answers[0]} \nB. ${answers[1]} \nC. ${answers[2]} \nD. ${answers[3]} \n`).then(function (sentMsg) {
            sentMsg.react('🇦')
            sentMsg.react('🇧')
            sentMsg.react('🇨')
            sentMsg.react('🇩')
            sentMsg.awaitReactions(filter, {max: 1, time: 15000, errors: ['time']})
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === correct_letter) {
                        message.reply('answered correctly!').then(user.correct += 1).then(user.save());
                    } else {
                        message.reply('WRONG!');
                    }
                })
                .catch(collected => {
                    message.channel.send(`No correct response given in time. Correct answer was ${correct_letter}.`);
                });
        });
    }
    
}

// THIS FUNCTION VERIFIES IF A USER HAS A HIGH ENOUGH ROLE TO USE THE COMMAND
function checkRoles(member) {
    return (member.roles.highest.name === 'member') ? 'True'
        : (member.roles.highest.name === 'boss') ? 'True'
        : 'False';
}
       
// RETURN AN ARRAY OF SHUFFLED ANSWERS FROM THE TRIVIA QUESTION RESPONSE OBJECT
function shuffleAnswers(trivia) {
    let answers = [he.decode(trivia.results[0].correct_answer), 
        he.decode(trivia.results[0].incorrect_answers[0]), 
        he.decode(trivia.results[0].incorrect_answers[1]),
        he.decode(trivia.results[0].incorrect_answers[2])];
    
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = answers[i]
        answers[i] = answers[j]
        answers[j] = temp
    }
    return answers;
}

// RETURN THE EMOJI THAT CORRESPONDS TO THE CORRECT ANSWER CHOICE AFTER THEY HAVE BEEN SHUFFLED
function getAnswer(trivia, answers) {
    let letter;
    switch(true) {
        case (he.decode(trivia.results[0].correct_answer) === answers[0]):
            letter = '🇦';
            break;
        case (he.decode(trivia.results[0].correct_answer) === answers[1]):
            letter = '🇧';
            break;
        case (he.decode(trivia.results[0].correct_answer) === answers[2]):
            letter = '🇨';
            break;
        case (he.decode(trivia.results[0].correct_answer) === answers[3]):
            letter = '🇩';
            break;
    }
    return letter;
}