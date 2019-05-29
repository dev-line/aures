const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const UserSchema = new mongoose.Schema({
    UserName: {
        type: String,
        unique: true,
        default: '',
        minlength: 5,
        required: true
    },
    FirstName: {
        type: String,
        default: '',
        required: true
    },
    LastName: {
        type: String,
        default: '',
        required: true
    },
    Email: {
        type: String,
        unique: true
    },
    Password: {
        type: String,
        default: '',
        minlength: 5,
        required: true
    },
    Role: {
        type: String,
        default: 'blogger',
        required: true
    },
    SecretQ: [],
    Avatar: {
        type: String,
        default: '/public/img/icons/logo.png'
    },
});

UserSchema.methods.encryptPassword = ((Password) => {
    return bcrypt.hashSync(Password, bcrypt.genSaltSync(10));
});

UserSchema.methods.ValidUserPassword = ((Password, CPassword) => {
    return bcrypt.compareSync(Password, CPassword);
})

module.exports = mongoose.model('Users', UserSchema);