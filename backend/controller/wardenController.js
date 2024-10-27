// import express from 'express';
// import cors from 'cors';
// import db from '../db';

// const app = express();
// app.use(cors());
// app.use(express.json());

// export const getWardenByid = async (req, res) => {
//   try {
//     const { warden_id } = req.params;
//     const warden = await db.pool.query('SELECT * FROM warden WHERE warden_id = $1', [warden_id]);
//     res.json(warden.rows);
//   } catch (err) {
//     console.log(err.message);
//   }
// };
