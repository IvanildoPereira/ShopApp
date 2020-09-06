const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const io = require('../config/socket')
const crypto = require('crypto');
const { registerValidation, loginValidation } = require('../validation/validation');
const Queue = require('../lib/Queue');
const HttpError = require("../models/http-error");
require('dotenv/config');

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    // Validate the body request
    const { error } = registerValidation(req.body);
    if (error) {
        return next(new HttpError(error.details[0].message, 400))
    }

    // Check if the user is already in the database
    const emailExist = await User.findOne({ where: { email } });
    if (emailExist) {
        return next(new HttpError("Email already existed!", 400));
    }
    // Hash the passwords
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ avatar_img: null, name, email, password: hashedPassword });
        user.createCart();
        Queue.add('RegistrationMail', { user });
        res.status(200).json({ message: "Created with sucess!!" })
    } catch (err) {
        const error = new HttpError("It wasn't possible create a new account!", 500);
        return next(error)
    }

}

const login = async (req, res, next) => {
    // Validate the body of request
    const { error } = loginValidation(req.body);
    if (error) {
        return next(new HttpError(error.details[0].message, 400))
    }

    // Checking if the email exists
    const emailExist = await User.findOne({ where: { email: req.body.email } });
    if (!emailExist) {
        return next(new HttpError("Email doesn't exist", 404));
    }
    // Checking if password is correct
    const validPassword = await bcrypt.compare(req.body.password, emailExist.password);
    if (!validPassword) {
        return next(new HttpError('Password is invalid!', 400));
    }
    // Create and assign a token
    const token = jwt.sign({ id: emailExist.id, email: emailExist.email }, process.env.TOKEN_SECRET, { expiresIn: "1h" });

    // Socket connection
    io.getIO().on('connection', socket => {
        socket.on('user_connected', userId => {
            socket.join(userId)
            setTimeout(() => socket.leave(userId), 1000 * 60 * 60) //one hour
            //  var client = socket.adapter.rooms

        })
        socket.on('user_disconnected', userId => {
            socket.leave(userId)
            // var client = socket.adapter.rooms

        })

    })
    res.status(200).json({
        message: "Logged with success",
        token: token,
        id: emailExist.id
    })
}

const getUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userData.id);
        if (!user) return res.status(404).json({ Message: "User doesn't exist!" });
        res.json(user);
    } catch (err) {
        const error = new HttpError("Can't get the user!", 500);
        return next(error)
    }
}

const updateUser = async (req, res, next) => {
    const { name, email, oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.userData.id);
    let hashedPassword;
    let avatar = user.avatar_img;
    if (!user) return res.status(404).json({ Message: "User doesn't exist!" });

    if (req.file !== undefined) {
        avatar = req.file.path;
    }

    // Check if the user is already in the database
    const emailExist = await User.findOne({ where: { email } });
    if (emailExist && email !== user.email) {
        return next(new HttpError("Email already existed! Try Another Email", 400));
    }


    if (newPassword) {
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) {
            return next(new HttpError('Password is invalid!', 400));
        }
        hashedPassword = await bcrypt.hash(newPassword, 10);
    } else {
        hashedPassword = user.password;
    }

    try {
        await user.update({
            name,
            email,
            password: hashedPassword,
            avatar_img: avatar
        });
        res.json({ message: "Updated user with Success!" })

    } catch (err) {
        const error = new HttpError("It wasn't possible update the user!", 500);
        return next(error)

    }
}

const forgotPassword = async (req, res, next) =>{
    const { email } = req.body;


    // Check if the user is already in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(new HttpError("Email doesn't exist in your DataBase!", 400));
    }

    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);

    try {
        await user.update({
            passwordResetToken: token,
            passwordResetExpires: now
        });
        Queue.add('RecoveryPassword', { email, token });
        res.json({ message: "Check your email to reset the password!" })

    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error)

    }
}

const verifyToken = async (req, res, next) =>{
    const { token } = req.body;

    const user = await User.findOne({ where: { passwordResetToken: token } });
    if (!user) {
        return next(new HttpError("Token Invalid!", 400));
    }

    const now = new Date();
    if( now > user.passwordResetExpires){
        return next(new HttpError("Token expired, generete a new one!", 403));
    }

    res.json({name: user.name})
}

const resetPassword = async (req, res, next) =>{
    const { token, newPassword } = req.body;
    const user = await User.findOne({ where: { passwordResetToken: token }});


    if(!user){
        return next(new HttpError("Token Invalid!", 403));
    }

    const now = new Date();
    if( now > user.passwordResetExpires){
        return next(new HttpError("Token expired, generete a new one!", 403));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        await user.update({
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null
        });
        res.json({ message: "Password Reseted with Success!" })

    } catch (err) {
        const error = new HttpError("It wasn't possible reset the Password!", 500);
        return next(error)

   }

    
}

exports.signup = signup;
exports.login = login;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.forgotPassword = forgotPassword;
exports.verifyToken = verifyToken;
exports.resetPassword = resetPassword;