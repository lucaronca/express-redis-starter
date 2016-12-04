const redis = require('redis'),
	//creates a new client
	client = redis.createClient();

client.on('connect', function() {
	console.log('connected to redis');
});

client.on('error', function(err){
	console.error(err);
});

client.on('warning', function(warn) {
	console.warn(warn);
});

module.exports = client;