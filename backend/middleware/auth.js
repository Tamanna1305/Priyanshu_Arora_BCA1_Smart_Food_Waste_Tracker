const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token decoded:', decoded);
    next();
  } catch (error) {
    console.log('Invalid token:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;