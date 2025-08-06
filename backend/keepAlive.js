import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({ url: process.env.REDIS_URL });

async function sendHeartbeat() {
  try {
    if (!client.isOpen) await client.connect();
    await client.set('heartbeat', Date.now().toString());
    console.log('✅ Redis heartbeat set');
  } catch (err) {
    console.error('❌ Redis heartbeat error:', err);
  }
}

// First call immediately
sendHeartbeat();

// Then every 24 hours
setInterval(sendHeartbeat, 24 * 60 * 60 * 1000);
