// config/redisClient.js
import { createClient } from 'redis';
import 'dotenv/config';
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 16224,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('Redis Connected'));

export default client;