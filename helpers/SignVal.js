module.exports = function SignUpValidation(req, res, next) {
    req.checkBody('username', 'Username is Required').notEmpty();
    req.checkBody('username', 'Username Must not be less than 5').isLength({
        min: 5
    });
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('email', 'Email is Invalid').isEmail();
    req.checkBody('password', 'Password is Required').notEmpty();
    req.checkBody('password', 'Password Must not be less than 5').isLength({
        min: 5
    });
    req.checkBody('cpassword', 'Passwords do not match').equals(req.body.password);
    req.checkBody('fname', 'First Name is Required').notEmpty();
    req.checkBody('lname', 'Last Name is Required').notEmpty();
    req.checkBody('question', 'Secret Question is Required').notEmpty();
    req.checkBody('answer', 'Answer is Required').notEmpty();

    req.getValidationResult()
        .then((result) => {
            const errors = result.array();
            const messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });
            req.flash('error', messages);

            res.redirect('/admin/signup');
        })
        .catch((err) => {
            return next();
        })
}