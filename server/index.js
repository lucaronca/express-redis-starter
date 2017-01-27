const
    path = require('path'),
    express = require('express'),
    app = express.Router(),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    client = require('./data/db'),
    passport = require('passport'),
    RedisStore = require('connect-redis')(session),
    open = require('open'),
    config = require('../config');

//
// Register middlewares
// ---------------------------------------------------------------------------------------
app.use(require('./middlewares/error'));
app.use(require('./middlewares/commonRender'));

//
// static paths
// ---------------------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/build', express.static(path.join(__dirname, '..', 'client', 'build')));
app.use('/docs', express.static(path.join(__dirname, '..', 'uploads')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// ---------------------------------------------------------------------------------------
const Auth = require('./helpers/Auth');
new Auth().setup();

// Create a new session and store it in an existing redis client
app.use(session({
    store: new RedisStore({
        client: client
    }),
    secret: process.env.REDIS_STORE_SECRET || 'secret-test',
    resave: false,
    saveUninitialized: false
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

//
// Bootsrap server logic
// ---------------------------------------------------------------------------------------
app.use(require('./controllers'));

//
// Function for start the server
// ---------------------------------------------------------------------------------------
exports.start = (app) => {
    if (app.get('env') === 'development') open('http://localhost:' + config.port);
    app.listen(config.port, () => {
        console.log(`Listening on port ${config.port}...`)
    });
};

exports.app = app;