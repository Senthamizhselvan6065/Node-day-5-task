const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
     name: {type: String, required: true},
     email: {
        type: String,
        validate: validator.isEmail,
        required: true
     },
     password: {type: String, required: true},
     resetPasswordToken: String,
     resetPasswordExpire: Date,
     createAt: {type: Date, default: Date.now()}
})

module.exports = mongoose.model("user", userSchema);