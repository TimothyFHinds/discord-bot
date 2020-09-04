const fetch = require('node-fetch');

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send(`Give a first name as an argument`);
    if (args[1]) return message.channel.send(`Too many arguments given. You only have to provide a first name.`);
    
    const name = args[0];
    const age_guess = await fetch(`https://api.agify.io?name=${name}`);
    const response = await age_guess.json();

    if (response) {
        message.reply(`is probably ${response.age}. ${age_message(response.age)}`);
    } else {
        message.reply(`your name is whack, idk.`);
    }
}


// CHOOSE A MESSAGE BASED ON A PERSON'S GUESSED AGE
function age_message (age) {
    let msg;
    if (age && age > 0) {
        switch(true) {
            case (age < 6):
                msg = "Stop crying about Sunday school with pastor Tom, he's a nice man.";
                break;
            case(age < 12):
                msg = "Puberty is soon! Start stocking up on acne wash.";
                break;
            case(age < 16):
                msg = "You can't even drive lol get gud.";
                break;
            case(age < 21):
                msg = "You're old enough for war, but not a war with your liver. Go buy a Juul instead, that's cooler with the kids these days anyways.";
                break;
            case(age < 30):
                msg = "Don't settle down yet, you've still got a lot of partying to do.";
                break;
            case(age < 40):
                msg = "You're either rotting in a routine or shagging your way around.";
                break;
            case(age < 50):
                msg = "Over the hill with you!";
                break;
            case(age < 60):
                msg = "Hey! You're eligible to join the AARP!";
                break;
            case(age < 70):
                msg = "Wear a mask and avoid the outside world.";
                break;
            default:
                msg = "Enjoy your remaining years!";
                break;
        }
    }
    return msg;
}
