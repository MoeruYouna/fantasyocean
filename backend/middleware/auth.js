const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token received:', token); // Add this to see if the token is being sent
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Add this to see if the token is being correctly decoded
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Invalid token:', error.message); // Log the error message
    return res.status(400).json({ message: 'Invalid token.' });
  }
};


module.exports = authMiddleware;
