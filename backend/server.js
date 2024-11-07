import express from 'express';
import cors from 'cors';
import MongoDB from './config/MongoDB.js';
import client from './config/redisClient.js';
import SocketService from './config/socket.js';
// import complaintRoutes from './routes/complaintRoutes.js';
// import studentRoutes from './routes/studentRoutes.js';
// import wardenRoutes from './routes/wardenRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import http from 'http';


const app = express();
MongoDB();

app.use(cors());
app.use(express.json());

app.use("/grievances/", grievanceRoutes);
// app.use("/", studentRoutes);
// app.use("/", wardenRoutes);
app.use("/users/", userRoutes);
app.use("/chat/", chatRoutes);

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
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
