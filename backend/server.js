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

const fishRoutes = require('./src/routes/fishRoutes');
app.use('/fishs', fishRoutes);

const accRoutes = require('./src/routes/accRoutes');
app.use('/accounts', accRoutes);

const loginRoute = require('./src/routes/loginRoutes');
app.use('/login', loginRoute);

const cartRoute = require('./src/routes/cartRoutes');
app.use('/carts', cartRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

