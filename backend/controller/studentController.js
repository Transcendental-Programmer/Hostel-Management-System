// import express from 'express';
// import cors from 'cors';
// import db from '../db';

// const app = express();
// app.use(cors());
// app.use(express.json());

// export const getStudentByid = async (req, res) => {
//   try {
//     const { student_id } = req.params;
//     const student = await db.pool.query('SELECT * FROM student WHERE student_id = $1', [student_id]);
//     res.json(student.rows);
//   } catch (err) {
//     console.log(err.message);
//   }
// };
