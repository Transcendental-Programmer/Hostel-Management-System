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

  // Wait for db to be ready, max 20s (20 attempts with 1s delay)
  let db;
  for (let i = 0; i < 20; i++) {
    db = mongoose.connection.db;
    if (db) break;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  if (!db) throw new Error('MongoDB connection db still undefined after 20s');

  const result = await db.command({ ping: 1 });
  console.log(`✅ MongoDB ping result: ${result.ok}`);
} catch (err) {
  console.error('❌ MongoDB heartbeat error:', err);
}

}

sendHeartbeats();
setInterval(sendHeartbeats, 24 * 60 * 60 * 1000);
