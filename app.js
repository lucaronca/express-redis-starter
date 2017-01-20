const
	express = require('express'), 
	app = express(),
	path = require('path'),
	bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session'),
    client = require('./db'),
    RedisStore = require('connect-redis')(session),
	webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    chalk = require('chalk'),
    open = require('open');

app.set('port', (process.env.PORT || 5000));

// Error middleware
app.use(require('./middlewares/error'));

// View Engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// public paths
app.use('/build', express.static(path.join(__dirname, 'public', 'build')));
app.use('/docs', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


let env = process.env.NODE_ENV || 'production';
app.set('env', env);

// Adding a common render
app.use(require('./middlewares/commonRender'));

// Authentication
const Auth = require('./helpers/Auth');
new Auth().setupPassport();

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

// start webpack
const webpackConfig = require('./webpack.config')(env);
let compiler = webpack(webpackConfig);

if (env === 'production') {
    compiler.apply(new webpack.ProgressPlugin());

    return compiler.run((err, stats) => {

        if (err) next(err);

        // get the list of built assets
        let assets = stats.toJson().assets;

        //set the list globally
        app.set('assets', assets);

        // once the assets' name are resolved, start the app
        startServer();

    });
}

// Development
console.log(chalk.cyan('Starting development server...'));
let webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false, // this reduces the amount of stuff I see in my terminal; configure to your needs
        'errors-only': true
    }
});

app.use(webpackDevMiddlewareInstance);
app.use(webpackHotMiddleware(compiler, {
    log: console.log
}));

webpackDevMiddlewareInstance.waitUntilValid(startServer);

function startServer() {
    let port = app.get('port');
    if (env === 'development') open('http://localhost:' + port);
    app.listen(port, () => {
        console.log('Listening on port ' + port)
    });
}