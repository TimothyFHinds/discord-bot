const fetch = require('node-fetch');

module.exports.run = async(client, message, args) => {
    const joke = await fetch('https://api.icndb.com/jokes/random');
    const response = await joke.json();
    if (response) {
        message.channel.send(`${response.value.joke}`);
    } else {
        message.channel.send(`Chuck can't come to the phone right now, you'll have to try again later.`);
    }
}
