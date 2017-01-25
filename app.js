const
	express = require('express'), 
	app = express(),
	path = require('path'),
	webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    chalk = require('chalk');

app.set('port', (process.env.PORT || 5000));

let env = process.env.NODE_ENV || 'production';
app.set('env', env);

// Include server routes as a middleware
require('./server')(app);

// start webpack
const webpackConfig = require('./tools/webpack.config.js')(env);
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


// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
const chokidar = require('chokidar');
const watcher = chokidar.watch('./server');

watcher.on('ready', function() {
    watcher.on('all', function() {
        console.log("Clearing /server/ module cache from server");
        Object.keys(require.cache).forEach(function(id) {
            /*if (/[\/\\]server[\/\\]/.test(id))*/ delete require.cache[id];
        });
    });
});

function startServer() {
    let http = require('http');
    const server = http.createServer(app);
    server.listen(app.get('port'), 'localhost', function(err) {
        if (err) throw err;

        const addr = server.address();

        console.log('Listening at http://%s:%d', addr.address, addr.port);
    });
}