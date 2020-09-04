const fetch = require('node-fetch');

module.exports.run = async(client, message, args) => {
    const bored = await fetch('https://www.boredapi.com/api/activity');
    const response = await bored.json();
    if (response) {
        message.reply(`${response.activity}`);
    } else {
        message.reply(`whatever you do, don't pet a burning dog.`);
    }
}


    
