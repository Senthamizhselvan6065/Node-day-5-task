/* user router */
const userRouter = require("express").Router();
/* async catch error handler */
const expressAsyncHandler = require("express-async-handler");
/* User Schema */
const User = require("../models/userModel");
/* hashPassword */
const {hashPassword, comparePassword, getResetToken, createJwtToken} = require("../config/auth");
/* Error Handler */
const ErrorHandler = require("../middlewares/ErrorHandler");
/* send Email */
const sendEmail = require("../config/email");
/* crypto */
const crypto = require("crypto");

/* method = get */
/* url Path = /api/user/getuser */
userRouter.get("/getuser", expressAsyncHandler( async (req, res, next) => {
    const user = await User.find();
      res.status(200).json({
            success: true,
            message: "get all user...",
            user
      })
}))

 
/* method = post */
/* url Path = /api/user/register */
userRouter.post("/register", expressAsyncHandler( async (req, res, next) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return next(new ErrorHandler(401, "Please enter your name, email and password"))
    }
    const user = await User.findOne({email});
    if(user){
         return next(new ErrorHandler(401, "Already used this Email..."));
    }
    if(!user){
        /* hashed password */
        let hash = await hashPassword(password);
        const  newUser = await User({
             name: name,
             email: email,
             password: hash
        });
        await newUser.save(); 
        if(!newUser){
            return next(new ErrorHandler(400, "Does not create user name, email and password..."));
         };
         res.status(200).json({
            success: true,
            message: "Register successfully...",
            newUser
        });
    };
}))


/* method = post */
/* url Path = /api/user/login */
userRouter.post("/login", expressAsyncHandler( async (req, res, next) => {
      const {email, password} = req.body; 
      if(!email || !password){
          return next(new ErrorHandler(400, "Please enter your email and password..."));
      }
      /* find the user email in database */
      const user = await User.findOne({email});
      if(!user){
         return next(new ErrorHandler(401, "user does not exists..."));
      }
      if(user){
        /* compare password */
        const passwordCompare = await comparePassword(password, user.password)
        if(passwordCompare){
            const token = await createJwtToken(user);
            if(token){
                res.status(201).send({
                    success: true,
                    message: "Login successfully...",
                    token,
                    user
                 });
            }
        };
        if(!passwordCompare){
            return next(new ErrorHandler(401, "Please enter your proper Password..."));
        }
      }
      
}));

/* method = post */
/* url Path = /api/user/login */
userRouter.post("/forgot/password", expressAsyncHandler( async (req, res, next) => {
    const {email} = req.body;
    if(!email){
        return next(new ErrorHandler(401, "Please enter your proper Email..."));
    };
      /* find the user email in database */
    const user = await User.findOne({email});
    const resetToken = await getResetToken(user)
    await user.save();

    let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get("host")}`
    }

    /* create reset url */
    const resetUrl = `<a href=${BASE_URL}/reset/password/${resetToken}> Rest your password </a>`;
     /* email send nessage */
    const message = `Your password reset url is as follows\n\n ${resetUrl}\n\n if you have not requested this email, then ignore it`;
    /* send email */
    try {
        sendEmail({
            email: user.email,
            subject: "Forgot Password Request...", 
            message            
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
     } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler(500, error.message))
     }
}));


/* method = post */
/* url Path = /api/user/reset/password */
userRouter.post("/reset/password/:token", expressAsyncHandler( async (req, res, next) => {
     const {password, confirmPassword} = req.body;
     if(!password || !confirmPassword){
        return next(new ErrorHandler(400, "Please enter your password and confirm password..."));
     }
     const {token} = req.params;
     /* hash token */
     const hashToken = await crypto.createHash("sha256").update(token).digest("hex");
     /* compare the send email token and user database resetPasswordToken and resetPasswordExpire time */
     const user = await User.findOne({
        resetPasswordToken: hashToken,
        resetPasswordExpire: {
            $gt: Date.now()
        }
     })  
     if(!user){
        return next(new ErrorHandler(401, "Please reset token is invalid or expired..."));
     };
     
     if(password !== confirmPassword){
        return next(new ErrorHandler(401, "Password does not match..."));
     }
     /* hashPassword */
     let hashpassword =  await hashPassword(password)
     user.password = hashpassword;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpire = undefined;
     await user.save();
     res.status(200).json({
         success: true,
         message: "Password created successfully...",
         user
     })
}))

module.exports = userRouter;