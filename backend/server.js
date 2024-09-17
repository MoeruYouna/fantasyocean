require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();
const PORT = 5000;

app.use(cors());
// Middleware
app.use(express.json());

// MongoDB connection
//mongoose.connect('mongodb+srv://charlotteisville:Phuong%40n2011@cluster0.e5okuec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
mongoose.connect('mongodb://localhost:27017')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB', err);
  });

//Connect to Router
const fishRouter = require('./routes/Fish.router')
app.use('/fishs', fishRouter);

const accRouter = require('./routes/Auth.router');
app.use('/api/auth', accRouter);

const cartRouter = require('./routes/Cart.router');
app.use('/carts', cartRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

