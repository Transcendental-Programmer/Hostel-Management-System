// config/redisClient.js
import { createClient } from 'redis';
import 'dotenv/config';
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis-16224.crce206.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: process.env.REDIS_PORT || 16224,
  },
  password: process.env.REDIS_PASSWORD || 'YnXNtPfK8mRUB3PYe1U4BPRit2XuMQQ5',
});

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('Redis Connected'));

export default client;