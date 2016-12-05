const redis = require('redis'),
	//creates a new client
	client = redis.createClient();

client.on('connect', () => {
	console.log('connected to redis');
});

client.on('error', (err) => {
	console.error(err);
});

client.on('warning', (warn) => {
	console.warn(warn);
});

module.exports = client;