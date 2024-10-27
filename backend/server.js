import express from 'express';
import cors from 'cors';
import MongoDB from './config/MongoDB.js';
import SocketService from './config/socket.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
MongoDB();

app.use(cors());
app.use(express.json());


app.use("/", grievanceRoutes);
app.use("/users/", userRoutes);

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});

// Initialize Socket.io
const socketServiceInstance = new SocketService();
socketServiceInstance.io.attach(server);

// Initialize Socket.io listeners
socketServiceInstance.initListeners();
