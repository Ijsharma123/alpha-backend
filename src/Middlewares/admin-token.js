require('dotenv').config(); //get env variables
const jwt = require('jsonwebtoken'); 

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Bearer');

  // Check if not token
  if (!token) { 
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    jwt.verify(token, process.env.JWT_Key, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.admin = decoded.admin;
        next();
      }
    });
  } catch (err) {
    console.error('Something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};
