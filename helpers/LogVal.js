module.exports = function SignUpValidation(req, res, next) {
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('password', 'Password is Required').notEmpty();
    req.checkBody('password', 'Password Must not be less than 5').isLength({
        min: 5
    });
    req.getValidationResult()
        .then((result) => {
            const errors = result.array();
            const messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });
            req.flash('error', messages);

            res.redirect('/admin/login');
        })
        .catch((err) => {
            return next();
        })
}