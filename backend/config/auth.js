const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


/* hashPassword function */
const hashPassword = async (password) => {
    /* hashed password */
    const hidePassword = bcrypt.hash(password, 10);
    return hidePassword;
}


/* compare password function */
const comparePassword = async (password, userPassword) => {
    /* compare the password */
    return await bcrypt.compare(password, userPassword)
}


/* create jwt token function */
const createJwtToken = async (user) => {
     let token = await jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRE_TIME})
     return token;
}


/* rcreate Reset Password Token function */
const getResetToken = async (user) => {
    /* gendrate token */
    const token = crypto.randomBytes(20).toString('hex');
    /* generate hash and set to resetPasswordToken */
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    /* set token exipre time */
    user.resetPasswordExpire = Date.now() + 30 * 60 * 60 * 1000;
    return token;
}


module.exports = {hashPassword, comparePassword, getResetToken, createJwtToken};