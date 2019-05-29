module.exports = (express, app) => {
    const http = require('http').Server(app),
        ejs = require('ejs-mate'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        path = require('path'),
        io = require('socket.io')(http),
        User = require('./models/Users'),
        validator = require('express-validator'),
        session = require('express-session'),
        cookieParser = require('cookie-parser'),
        mongoStore = require('connect-mongo')(session),
        mongoose = require('mongoose'),
        passport = require('passport'),
        passportStrategy = require('passport-local'),
        flash = require('connect-flash'),
        PassportConfig = require('./passport/passport-local');

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb+srv://zinou:nuGWF5F8Fm7eDU6@cluster0-hckfq.mongodb.net/TvChannel?retryWrites=true"', {
        useNewUrlParser: true
    });

    app.set('view engine', 'ejs');
    app.engine('ejs', ejs);
    app.use('/public', express.static('public'));
    app.use(express.static(__dirname + "/"));
    app.use(methodOverride('X-HTTP-Method')) //          Microsoft
    app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
    app.use(methodOverride('X-Method-Override')) //      IBM
    app.use(methodOverride('_method'))
    app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(flash());
    app.use(validator());
    app.use(session({
        secret: 'Somthing Secret Here',
        resave: true,
        saveUninitialized: false,
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    })
    http.listen(8080, () => {
        console.log('App listening on port 8080!');
    });
}