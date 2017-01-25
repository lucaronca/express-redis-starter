const
    path = require('path'),
    express = require('express'),
    app = express.Router(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    client = require('./data/db'),
    passport = require('passport'),
    RedisStore = require('connect-redis')(session);

// Error middleware
app.use(require('./middlewares/error'));

// View Engine
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'ejs');

// public paths
app.use('/build', express.static(path.join(__dirname, 'public', 'build')));
app.use('/docs', express.static(path.join(__dirname, 'public', 'uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Adding a common render
app.use(require('./middlewares/commonRender'));

// Authentication
const Auth = require('./helpers/Auth');
new Auth().setup();

// create a new session and store it existing redis client
app.use(session({
    store: new RedisStore({
        client: client
    }),
    secret: process.env.REDIS_STORE_SECRET || 'secret-test',
    resave: false,
    saveUninitialized: false
}));

// init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

// App logic
app.use(require('./controllers'));

module.exports = app;