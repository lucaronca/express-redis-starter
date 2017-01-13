const
	express = require('express'), 
	app = express(),
	path = require('path'),
	bodyParser = require('body-parser'),
	webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware');

app.set('port', (process.env.PORT || 5000));

// Error middleware
app.use(require('./middlewares/error'));

// View Engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// public paths
app.use('/build', express.static(path.join(__dirname, '/public/build')));
app.use('/docs', express.static(path.join(__dirname, '/uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// App logic
app.use(require('./controllers'));

// start webpack
let env = process.env.NODE_ENV || 'production';

// Handling webpack's assets including in templates
app.use(require('./middlewares/commonRender')(env));

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
        startServer()

    });
}

// Development
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
    app.listen(app.get('port'), () => {
        console.log('Listening on port ' + app.get('port'))
    });
}