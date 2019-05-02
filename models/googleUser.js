const mongoose = require("mongoose")
const Schema = mongoose.Schema

const GoogleUserSchema = new Schema({
    googleID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    image: {
        type: String,
    }
})

mongoose.model("GoogleUser", GoogleUserSchema)