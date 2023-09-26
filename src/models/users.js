const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Task = require("../models/task")

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error("Email is invalid!")
            }
        }
    },
    password: {
        type: String,
        require: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{ timestamps: true })

userSchema.virtual('tasks', {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject

}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_TOKEN)

    user.tokens = user.tokens.concat({token})
    await user.save()


    return token
}

userSchema.methods.Deletingalltask = async function(){
    const user = this
    await Task.deleteMany({owner: user._id})
    console.log("deleting task run successfully!")
    return user._id
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user){
        throw new Error('Unable to login: invalid email')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error("unable to login: invalid password")
    }

    return user
}

userSchema.pre("save", async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model("User",userSchema)

module.exports = User