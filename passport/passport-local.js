const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/Users");
const check = require("../helpers/AuthBy");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    "local.signup",
    new localStrategy({
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true
        },
        (req, email, Password, done) => {
            User.findOne({
                    Email: email
                },
                (err, user) => {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(
                            null,
                            false,
                            req.flash("error", "This email is already exist")
                        );
                    }
                    const NewUser = new User();
                    NewUser.UserName = req.body.username;
                    NewUser.Email = req.body.email;
                    NewUser.Password = NewUser.encryptPassword(req.body.password);
                    NewUser.FirstName = req.body.fname;
                    NewUser.LastName = req.body.lname;
                    if (req.body.username.lowercase = 'admin') {
                        NewUser.Role = 'Admin'
                    }
                    NewUser.SecretQ = [{
                        question: req.body.question,
                        answer: req.body.answer
                    }];
                    NewUser.save(err => {
                        done(null, NewUser);
                    });
                }
            );
        }
    )
);

passport.use(
    "local.login",
    new localStrategy({
            usernameField: "email" || "username",
            passwordField: "password",
            passReqToCallback: true
        },
        (req, email, password, done) => {
            User.findOne({
                    UserName: email
                },
                (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        check(req, user, password, done);
                    } else {
                        User.findOne({
                            Email: email
                        }, (err, User) => {
                            if (err) {
                                return done(err);
                            }
                            check(req, User, password, done);
                        })
                    }
                }
            );
        }
    )
);