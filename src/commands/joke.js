const fetch = require('node-fetch');

module.exports.run = async(client, message, args) => {
    const joke = await fetch('https://sv443.net/jokeapi/v2/joke/Any');
    const response = await joke.json();
    if (!response.error) {
        if (response.type === 'twopart') {
            message.channel.send(`${response.setup}`);
            message.channel.send('..');
            message.channel.send(`${response.delivery}`);
        } else if (response.type === 'single') {
            message.channel.send(`${response.joke}`);
        }
    } else {
        message.channel.send(`My funny bone is broken, I can't come up with jokes right now.`);
    }
}
