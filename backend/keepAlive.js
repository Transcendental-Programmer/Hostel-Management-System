import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
});

try {
  await client.connect();
  await client.set('heartbeat', Date.now().toString());
  console.log('✅ Redis heartbeat set');
  await client.disconnect();
  process.exit(0);
} catch (err) {
  console.error('❌ Redis heartbeat error:', err);
  process.exit(1);
}
