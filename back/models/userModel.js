const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {
    isEmail
} = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail]
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);