const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const router = express.Router()

require("../models/User")
const User = mongoose.model("users")

require("../config/passport")(passport)

const ensureAuthenticated = require("../auth/ensureAuthenticated")

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users',
        //this should redirect to some route which would be a prtotected route
        failureRedirect: '/users/login',
        // session: false // if not using sesion in nodejs
    })(req, res, next);
});


router.post("/signup", ((req, res) => {
    let errors = []
    let password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const name = req.body.name
    const email = req.body.email
    if (password !== confirmPassword) {
        errors.push({ error: "Passwords don't match" })
    }
    if (password.length < 6) {
        errors.push({ error: "Password length must be > 6" })
    }

    if (errors.length) {
        //sending all the values along with it to prevent the user to re- enter

        //only errors is required in reactJS, rest all will be fetched from state
        return res.status(400).json(errors);
    } else {
        User.findOne({ email })
            .then(user => {
                if (user) {
                    return res.status(400).json({ error: "User already exits" })
                } else {
                    let newUser = {}
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) {
                                console.log(err)
                                throw err
                            };
                            password = hash
                            newUser = new User({
                                name, email, password
                            })
                            newUser.save()
                                .then(res => console.log(res))
                                .catch(res => console.log(res))
                            return res.status(200).json(newUser)
                        })
                    })
                }
            })
            .catch(er => console.log(er))
    }
}))

router.get("/", ((req, res) => {
    User.find({}).then(resp => {
        return res.status(200).json(resp)
    }).catch(er => {
        return res.status(400).json(er)
    })
}))

// ensureAuthenticated,
router.get("/logout", (req, res) => {
    req.logout()
    res.status(200).json({ message: "Logged out" })
})

module.exports = router