const User = require("../models/users")
require("dotenv").config()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const CreateUser = async  (req,res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = user.generateAuthToken()
        res.status(201).send({ user, token})
    }catch(e) {
        res.send(e)
    }
}

const GetUser = async (req,res) => {

    try{
        const user = await User.find({})
        res.send(user)

    }catch(e){
        res.send(e)
    }
}



const GetUserbyId = async (req,res) => {
    const id = req.params.id

    
    try{
        const user = await User.findOne({_id : id})
        res.send(user)    
    }catch(e){
        res.send(e)
    }
 }

 const UpdateUser = async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password"]
    const isValidOperation = updates.every((updates) => allowedUpdates.includes(updates))

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid Updates!"})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        res.send(req.user)

    }catch(e){
        res.send(e)
    }
 }

 const DeleteUser = async (req,res) => {
    try{
        await User.findOneAndDelete({_id: req.user._id})
        await req.user.Deletingalltask()
        res.send(req.user)
    }catch(e){
        res.send("failed")
    }
 }

 const LoginUser = async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({user, token})

    }catch(e){
        res.send(e)
    }
 }

 const GetAuthUser = async (req,res) => {
    res.send(req.user)
}

const LogoutUser = async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send("User Logged out")

    }catch(e){
        res.status(500).send(e)
    }
}

const LogoutAll = async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send("User all token expired!")
    }catch(e){
        res.status(500).send()
    }
}

const AvatarUpload = async (req,res) => {
        // Your avatar upload logic here
        const user = req.user
        const avatarData = req.file.buffer
        user.avatar = avatarData
        await user.save()
        res.send({"Avatar uploaded successfully! bufferData: ": user.avatar})
}
const AvatarUploadError = async (error,req,res,next) => {
    // Your avatar upload logic here
    res.send({error: error.message})
}

const getAvatar = async (req, res) => {
    try {
        const user = req.user; // Assuming you have the authenticated user available in req.user

        if (!user.avatar) {
            throw new Error("Avatar not found.");
        }

        let contentType = "image/jpeg"; // Default content type
        if (user.avatar.toString("utf-8").startsWith("data:image/jpeg")) {
            contentType = "image/jpeg";
        } else if (user.avatar.toString("utf-8").startsWith("data:image/png")) {
            contentType = "image/png";
        } else if (user.avatar.toString("utf-8").startsWith("data:image/jpg")) {
            contentType = "image/jpg";
        }

        res.set("Content-Type", contentType); // Set appropriate content type
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send(error.message);
    }
}

const DeleteAvatar = async(req,res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send({"Deleted successfuly User: " : req.user})
    }catch(error){
        res.send(error)
    }
}


const sendEmail = async (req, res) => {
    try {
        const user = req.user; // Assuming you have the authenticated user available in req.user

        const { to, subject, text, html } = req.body; // Extract email data from request body

        const msg = {
            to: to, // Recipient's email address
            from: "mfaizanullah336@gmail.com", // Sender's email address (should match your SendGrid verified sender)
            subject: subject,
            text: text,
            html: html,
        };

        await sgMail.send(msg);
        res.send('Email sent successfully.');
    } catch (error) {
        res.status(500).send('Error sending email.');
    }
};


module.exports = {
    CreateUser,
    GetUser,
    GetUserbyId,
    UpdateUser,
    DeleteUser,
    LoginUser,
    GetAuthUser,
    LogoutUser,
    LogoutAll,
    AvatarUpload,
    AvatarUploadError,
    getAvatar,
    DeleteAvatar,
    sendEmail
}