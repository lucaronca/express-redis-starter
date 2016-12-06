const express = require('express'), 
	app = express(),
	path = require('path'),
	bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

// View Engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Common middlewares
app.use(require('./middlewares/render'));

// App logic
app.use(require('./controllers'));

app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'))
});