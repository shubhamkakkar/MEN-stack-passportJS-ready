const express = require("express")
const passport = require("passport")
const router = express.Router()


//load GoogleUser modal
require("../models/googleUser")
require("../config/googleOauth")(passport)


router.get("/google", passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]
}))

router.get("/google/callback",
    passport.authenticate(
        "google",
        { failureRedirect: "/fail" }),
    (req, res) => {
        res.redirect("/")
    }
)

module.exports = router
