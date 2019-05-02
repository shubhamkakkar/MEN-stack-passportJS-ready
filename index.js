const express = require("express")
const mongoose = require("mongoose")

const password = require("./password")

const bodyParser = require('body-parser');
const passport = require('passport');


const users = require("./routes/users")
const googleOauth = require("./routes/auth")
const app = express()
const session = require('express-session')

mongoose.connect(
    `mongodb+srv://shubhamkakkar:${password}@nodejsapi-learn-rhsrv.mongodb.net/test?retryWrites=true`
    , { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        }
    })
    .then(() => console.log("mongoDB connected"))
    .catch(er => console.log(er))

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('trust proxy', 1) // trust first proxy

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

//user - login / signup
app.use("/users", users)
app.use("/auth", googleOauth)
app.get("/fail", (req, res) => {
    return res.status(500).json({ error: "Failed request" })
})



app.use(passport.initialize())
//passport session needs express session to run properly hence epress session is above it
app.use(passport.session())
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`${PORT} is runnning`))