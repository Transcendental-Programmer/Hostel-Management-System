// config/redisClient.js
import { createClient } from 'redis';
import 'dotenv/config';
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST ,
    port: process.env.REDIS_PORT ,
  },
  password: process.env.REDIS_PASSWORD ,
});

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('Redis Connected'));

export default client;