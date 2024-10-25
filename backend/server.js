import express from 'express';
import cors from 'cors';
import MongoDB from './config/MongoDB.js';

// import complaintRoutes from './routes/complaintRoutes.js';
// import studentRoutes from './routes/studentRoutes.js';
// import wardenRoutes from './routes/wardenRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
MongoDB();

app.use(cors());
app.use(express.json());

// app.use("/", complaintRoutes);
// app.use("/", studentRoutes);
// app.use("/", wardenRoutes);
app.use("/", userRoutes);

app.listen(3000, () => {
  console.log("Application is running on port 3000");
});
