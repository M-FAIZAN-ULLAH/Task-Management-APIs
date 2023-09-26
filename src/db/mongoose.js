const mongoose = require("mongoose")

const url = process.env.MONGO_URI

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})