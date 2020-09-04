const fetch = require('node-fetch');

module.exports.run = async(client, message, args) => {
    const cat_facts = await fetch('https://cat-fact.herokuapp.com/facts/random');
    const response = await cat_facts.json();
    message.channel.send(`🐈 ${response.text} 🐈`);
}
