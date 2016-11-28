const redis = require('redis'),
	//creates a new client
	client = redis.createClient();

client.on('connect', function() {
	console.log('connected to redis');
});

module.exports = client;