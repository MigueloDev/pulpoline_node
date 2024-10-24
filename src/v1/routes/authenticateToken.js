// authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.', code_message: 'token_not_provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.currentUser = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Su session ha expirado', code_message: 'token_expired' });
  }
};

module.exports = {
  authenticateToken
};