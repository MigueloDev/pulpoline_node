const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const cryptoController = require('../../controllers/cryptoController');
const { authenticateToken } = require('../routes/authenticateToken');

router.post('/auth/login', authController.login)
      .post('/auth/register', authController.register)
      .get('/auth/authtenticated', authenticateToken, authController.authtenticated)
      .post('/auth/logout', authenticateToken, authController.logout)
      .post('/auth/refresh-token', authController.refreshToken)
      .post('/create-token-hederar', authenticateToken, cryptoController.createToken)
      .get('/list-tokens', authenticateToken, cryptoController.listTokens);

module.exports = router;