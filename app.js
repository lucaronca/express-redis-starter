const
	express = require('express'), 
	app = express(),
	path = require('path'),
	bodyParser = require('body-parser'),
	errorHandler = require('./middlewares/error');

app.set('port', (process.env.PORT || 5000));

// View Engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// App logic
app.use(require('./controllers'));

// Error middleware
app.use(errorHandler);

app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'))
});