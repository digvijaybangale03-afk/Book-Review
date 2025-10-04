const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookreview';

mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=> {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log('Server running on port', PORT));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
