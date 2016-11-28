const redis = require('redis'),
	client = redis.createClient();

client.on('connect', function() {
	console.log('connected to redis');
});

 //creates a new client
module.exports = client;