const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username: String,
    userID: {type: String, required: true, unique: true },
    asked: {type: Number, default: 0},
    correct: {type: Number, default: 0}
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);