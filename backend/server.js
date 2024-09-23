require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/assets/img/profile', express.static(path.join(__dirname, 'assets/img/profile')));

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

const itemRouter = require('./routes/Item.router')
app.use('/items', itemRouter);

const authRouter = require('./routes/Auth.router');
app.use('/api/auth', authRouter);

const userRouter = require('./routes/User.router');
app.use('/api/user', userRouter);

const cartRouter = require('./routes/Cart.router');
app.use('/carts', cartRouter);

const checkRouter = require('./routes/Checkout.router');
app.use('/check', checkRouter)

const catFrouter = require('./routes/CatF.router');
app.use('/catF', catFrouter)

const catIrouter = require('./routes/CatI.router');
app.use('/catI', catIrouter)


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

