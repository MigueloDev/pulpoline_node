const authService = require('../services/authService');

const login = (req, res) => {
  console.log(req.body)
  return authService.login(req.body, res);
}

const logout = (req, res) => {
  return authService.logout(req, res);
}

const register = (req, res) => {
  return authService.register(req.body, res);
}

const refreshToken = (req, res) => {
  return authService.refreshToken(req, res);
}

const authtenticated = (req, res) => {
  return res.json({ message: 'Autenticado' });
}

module.exports = {
  login,
  logout,
  register,
  refreshToken,
  authtenticated
}