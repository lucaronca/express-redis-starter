const redis = require('redis'),
	//creates a new client
	client = redis.createClient( 7000, '127.0.0.1', {'return_buffers': true} );

client.on('connect', function() {
	console.log('connected to redis');
});

redis.on('error', errorHandler);

client.on('error', errorHandler);

client.on('warning', function(warn) {
	console.warn(warn);
});

function errorHandler(err) {
	console.error('Redis error', err);
}

module.exports = client;