const redis = require('redis');
const client = redis.createClient();

client.connect().then(() => {
  client.set('heartbeat', Date.now().toString()).then(() => {
    console.log('Redis heartbeat sent');
    client.quit();
  });
});
