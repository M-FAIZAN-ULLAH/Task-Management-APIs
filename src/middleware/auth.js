const User = require("../models/users")
const jwt = require("jsonwebtoken")

const auth = async (req,res,next) => {
    try{

    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_TOKEN)
    const user = await User.findOne({_id: decoded._id, 'tokens.token':token})

    if (!user){
        throw new Error()
    }

    req.token = token
    req.user = user
    console.log(" Authenticated user found: ",user.name, decoded)
    next()

   } catch(e){
    res.send({error: "Please Authenticate!"})
   }
}

module.exports = auth