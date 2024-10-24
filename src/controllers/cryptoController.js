const cryptoService = require('../services/cryptoService');

const createToken = (req, res) => {
  return cryptoService.createToken(req, res);
}

const listTokens = (req, res) => {
  return cryptoService.listTokens(req, res);
}

module.exports = {
  createToken,
  listTokens
}