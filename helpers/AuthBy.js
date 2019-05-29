module.exports = function check(req, user, password, done) {
    const messages = [];
    if (!user || user.ValidUserPassword(password, user.Password) != true) {
        messages.push("Email Or Password Invalid");
        return done(null, false, req.flash("error", messages));
    }
    console.log(req.user);
    return done(null, user);
}