const GoogleStrategy = require("passport-google-oauth20").Strategy
const mongoose = require("mongoose")
const keys = require("../googleOAuthCredentials")

const GoogleUser = mongoose.model("GoogleUser")
module.exports = passport => {
    passport.use(
        new GoogleStrategy({
            clientID: keys.client_id,
            clientSecret: keys.clientSecret,
            callbackURL: "/auth/google/callback",
            proxy: true
            //to allow load with https
        }, (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleID: profile.id,
                email: profile.emails[0].value,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                image: profile.photos[0].value
            }
            GoogleUser.findOne({
                googleID: profile.id
            }).then(user => {
                if (user) {
                    done(null, user)
                } else {
                    new GoogleUser(newUser).save()
                        .then(user => done(null, user))
                }
            })
        })
    )
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        GoogleUser.findById(id)
        .then(user => done(null, user))
    })

}