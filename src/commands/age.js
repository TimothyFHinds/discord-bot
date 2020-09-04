const fetch = require('node-fetch');

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send(`Give a first name as an argument`);
    if (args[1]) return message.channel.send(`Too many arguments given. You only have to provide a first name.`);
    
    const name = args[0];
    const age_guess = await fetch(`https://api.agify.io?name=${name}`);
    const response = await age_guess.json();

    if (response) {
        message.reply(`is probably ${response.age}.`);
    } else {
        message.reply(`your name is whack, idk.`);
    }
}

