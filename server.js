const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');
const userRouter = require('./Router/userRouter');
const fileRoutes = require('./Router/userRouter'); // ✅ ADD
dotenv.config();   // 👈 MUST BE BEFORE using process.env
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./Router/userRouter'));
// app.use('/api/profile', require('./Router/profileRouter'));

app.use('/api/files', fileRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
