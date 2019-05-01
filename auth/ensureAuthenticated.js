module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("yes")
        return next()
    } else {
        return res.status(400).json({ error: "not logged in" })
    }
}