// REQUIRED MODULES
require('dotenv').config();
const { Client } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

// MONGOOSE SETUP
const mongoose = require('mongoose');
const User = require('./models/user.js');
mongoose.connect(process.env.mongo_connect, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to mongoose');
});

// CLIENT OBJECT, COMMAND PREFIX VARIABLE
const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});
const PREFIX = "$";

client.commands = new Map();

// AFTER SERVER LOGIN
client.on('ready', () => {
    console.log(`${client.user.username} IS READY TO PURGE!`);
});



// AFTER MESSAGE IS SENT
client.on('message', async (message) => {
    // IGNORE BOT MESSAGES
    if (message.author.bot) return;

    // IGNORE MESSAGES WITHOUT THE PREFIX
    if (!message.content.startsWith(PREFIX)) return;

    let cmdArgs = message.content.substring(message.content.indexOf(PREFIX)+1).split(new RegExp(/\s+/));
    let cmdName = cmdArgs.shift();

    // IF COMMAND EXISTS
    if(client.commands.get(cmdName)) {
        
        // RUN THE COMMAND
        client.commands.get(cmdName).run(client, message, cmdArgs);
    } else {

        message.channel.send(`${cmdName} is an invalid command.\nType $help to see the list of available commands`);
    }
        
});

// NEW MEMBERS MUST REACT TO THIS MESSAGE TO GAIN MEMBERSHIP ROLE
client.on('messageReactionAdd', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if(reaction.message.id === '751254074820788275') {
        switch(name) {
            case '💯':
                member.roles.add('399607761765269515');

                // ADD USER TO STAT DATABASE
                const user = new User({
                    username: member.username,
                    userID: member.id
                });
                user.save()
                .then(res => console.log(res))
                .catch(err => console.log(err));
                
                break;
        }
    }
});

// MEMBERS CAN REMOVE THEIR MEMBERSHIP BY UN-REACTING TO THE MESSAGE
client.on('messageReactionRemove', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if(reaction.message.id === '751254074820788275') {
        switch(name) {
            case '💯':
                member.roles.remove('399607761765269515');
                break;
        }
    }
});

// MEMBER LEAVES THE SERVER
client.on('guildMemberRemove', (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'user-log');

    if (!channel) return;

    channel.send(`Bye, ${member}`);
})

// NEW MEMBER JOINS THE SERVER
client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'user-log');

    if (!channel) return;
    let msg = welcomemsg();
    channel.send(`Hi, ${member}! ${msg}`);
});

// CHOOSE BETWEEN 10 RANDOM WELCOME MESSAGES 
function welcomemsg () {
    let msgs = ['MA, THE MEATLOAF!', 
        'What\'s up yo?', 
        'You won\'t get a second chance for a first impression.', 
        'You\'re kinda cute :)', 
        'YO YO YO!',
        'GET READY TO PURGE!',
        'Get a load of this one..', 
        'Do a flip!',
        'Say heeeelllloooooooo!',
        'Please wipe your feet.']
    const chosen = Math.floor(Math.random() * 10); // random int 0-9
    return msgs[chosen];
}

// RECURSIVE FUNCTION TO RETRIEVE ALL COMMANDS WRITTEN
(async function registerCommands(dir = 'commands') {
    // read directory and files
    let files = await fs.readdir(path.join(__dirname, dir));

    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory()) {
            registerCommands(path.join(dir, file));
        } else {
            if(file.endsWith(".js")) {
                let cmdName = file.substring(0, file.indexOf(".js"));
                let cmdModule = require(path.join(__dirname, dir, file));
                client.commands.set(cmdName, cmdModule);
            }
        }
    }
})()


// LOG IN THE BOT USING TOKEN
client.login(process.env.DISCORDJS_BOT_TOKEN);






