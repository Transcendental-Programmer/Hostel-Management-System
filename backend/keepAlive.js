// keepAlive.js
import { createClient } from 'redis';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const pingClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});

pingClient.on('error', (err) => console.error('Redis PingClient Error:', err));
pingClient.on('connect', () => console.log('Redis PingClient Connected'));

async function sendHeartbeats() {
  // Redis
  try {
    if (!pingClient.isOpen) await pingClient.connect();
    await pingClient.set('heartbeat', Date.now().toString());
    console.log('✅ Redis heartbeat set');
  } catch (err) {
    console.error('❌ Redis heartbeat error:', err);
  }

  // MongoDB
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'test',
      });
    }
    // console.log('MongoDB connected:', mongoose.connection.name);
    if (!mongoose.connection.db) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const result = await mongoose.connection.db.command({ ping: 1 });
    console.log(`✅ MongoDB ping result: ${result.ok}`);
  } catch (err) {
    console.error('❌ MongoDB heartbeat error:', err);
  }
}

sendHeartbeats();
setInterval(sendHeartbeats, 24 * 60 * 60 * 1000);
