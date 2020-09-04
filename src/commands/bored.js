const fetch = require('node-fetch');

module.exports.run = async(client, message, args) => {
    const bored = await fetch('https://www.boredapi.com/api/activity');
    const response = await bored.json();
    if (response) {
        message.reply(`${response.activity}`);
    } else {
        message.reply(`here's a tip from my parents, GET A JOB.`);
    }
}


    