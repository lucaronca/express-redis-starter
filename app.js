const
	http = require('http');
    	express = require('express'),
	app = express(),
	path = require('path'),
	webpack = require('webpack'),
    	webpackDevMiddleware = require('webpack-dev-middleware'),
    	webpackHotMiddleware = require('webpack-hot-middleware'),
    	config = require('./config')
    	server = require('./server'),
    	chalk = require('chalk'),
	chokidar = require('chokidar');

app.set('env', process.env.NODE_ENV || 'production');

//
// View engine
// ---------------------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//
// Include server logic as a middleware
// ---------------------------------------------------------------------------------------
app.use((req, res, next) => {
    server.app(req, res, next);
});

//
// Start webpack
// ---------------------------------------------------------------------------------------
const webpackConfig = require('./tools/webpack.config')(app.get('env'));
let compiler = webpack(webpackConfig);

// Production
if (app.get('env') === 'production') {
    compiler.apply(new webpack.ProgressPlugin());

    return compiler.run((err, stats) => {

        if (err) next(err);

        // get the list of built assets
        let assets = stats.toJson().assets;

        //set the list globally
        app.set('assets', assets);

        // once the assets' name are resolved, start the app
        server.start(app);

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

webpackDevMiddlewareInstance.waitUntilValid(server.start.bind(server, app));

//
// Do 'hot-reloading' of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
// ---------------------------------------------------------------------------------------
const watcher = chokidar.watch('./server');

watcher.on('ready', () => {
    watcher.on('all', () => {
        console.log('Clearing /server/ module cache from server');
        Object.keys(require.cache).forEach((id) => {
            if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
        });
    });
});
