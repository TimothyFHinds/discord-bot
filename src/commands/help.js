const { MessageEmbed } = require('discord.js');

module.exports.run = async(client, message, args) => {
    let embedContent = (`$help shows these instructions.
        \n$play will ask you a trivia question! 
        \n$stats will show your trivia stats!
        \n$cat will give you a neat and interesting fact about cats!
        \n$age <Firstname> Will guess your age based on the firstname! 
        \n$bored will give you an idea. 
        \n$joke will tell you a joke! 
        \n$chuck will tell a Chuck Norris joke!`);
    let emb = new MessageEmbed;
    emb.setDescription(embedContent);
    emb.setColor('#63d6ff');
    emb.setTitle('How to use the Purge Bot');
    //emb.setTimestamp();
    message.channel.send(emb);

    //emb.setImage(message.author.displayAvatarURL());
    //emb.setAuthor(message.author.tag, message.author.displayAvatarURL());
    //emb.addField('Message', embedContent);
}
        
        
        