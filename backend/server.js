import express from 'express';
import cors from 'cors';
import MongoDB from './config/MongoDB.js';
import client from './config/redisClient.js';
<<<<<<< HEAD

// import complaintRoutes from './routes/complaintRoutes.js';
// import studentRoutes from './routes/studentRoutes.js';
// import wardenRoutes from './routes/wardenRoutes.js';
import userRoutes from './routes/userRoutes.js';
=======
import SocketService from './config/socket.js';
// import complaintRoutes from './routes/complaintRoutes.js';
// import studentRoutes from './routes/studentRoutes.js';
// import wardenRoutes from './routes/wardenRoutes.js';
import userRoutes from './routes/userRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import http from 'http';

>>>>>>> d9f5190202f74e21b65c61e05193f26624aa95c7

const app = express();
MongoDB();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// app.use("/", complaintRoutes);
// app.use("/", studentRoutes);
// app.use("/", wardenRoutes);
app.use("/users/", userRoutes);

// Initialize the Redis connection
await client.connect(
  console.log('Connected to Redis')
);
client.on('error', (err) => console.error('Redis Client Error', err));
=======
app.use("/", grievanceRoutes);
// app.use("/", studentRoutes);
// app.use("/", wardenRoutes);
app.use("/users/", userRoutes);
>>>>>>> d9f5190202f74e21b65c61e05193f26624aa95c7

// Initialize the Redis connection
await client.connect(
  console.log('Connected to Redis')
);
client.on('error', (err) => console.error('Redis Client Error', err));

// Create the HTTP server using the Express app
const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Application is running on port 3000");
});

// Initialize Socket.io
const socketServiceInstance = new SocketService();
socketServiceInstance.io.attach(server);

// Initialize Socket.io listeners
socketServiceInstance.initListeners();
