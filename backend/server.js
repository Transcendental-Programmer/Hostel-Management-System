import express from 'express';
import cors from 'cors';
import MongoDB from './config/MongoDB.js';
import client from './config/redisClient.js';

// import complaintRoutes from './routes/complaintRoutes.js';
// import studentRoutes from './routes/studentRoutes.js';
// import wardenRoutes from './routes/wardenRoutes.js';
import userRoutes from './routes/userRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';

const app = express();
MongoDB();

app.use(cors());
app.use(express.json());

app.use("/", grievanceRoutes);
// app.use("/", studentRoutes);
// app.use("/", wardenRoutes);
app.use("/users/", userRoutes);

// Initialize the Redis connection
await client.connect(
  console.log('Connected to Redis')
);
client.on('error', (err) => console.error('Redis Client Error', err));

app.listen(3000, () => {
  console.log("Application is running on port 3000");
});
