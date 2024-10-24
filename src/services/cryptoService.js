const { Client, TokenCreateTransaction, TokenInfoQuery } = require("@hashgraph/sdk");
const UserToken = require("../database/UserTokens");
require("dotenv").config();

const operatorId = process.env.MY_ACCOUNT_ID;
const operatorKey = process.env.MY_PRIVATE_KEY;
console.log(operatorId, operatorKey)
const client = Client.forTestnet();
client.setOperator(operatorId, operatorKey);

const createToken = async (req, res) => {
  const {name, symbol, initialSupply} = req.body;
  const {id: userId} = req.currentUser;

  try {
      const tokenCreateTx = await new TokenCreateTransaction()
          .setTokenName(name)
          .setTokenSymbol(symbol)
          .setDecimals(2)
          .setInitialSupply(initialSupply)
          .setTreasuryAccountId(process.env.MY_ACCOUNT_ID)
          .setTokenType(1)
          .execute(client);

      const receipt = await tokenCreateTx.getReceipt(client);
      const tokenId = receipt.tokenId.toString();
      await saveTokenIdToDatabase(userId, tokenId);
      return res.status(201).json({ tokenId, success:true, message: "Token creado exitosamente." });
  } catch (error) {
      console.log(error)
      console.error("Error creando el token:", error);
      return res.status(500).send({message: "Error al crear el token."});
  }
}

const saveTokenIdToDatabase = async (userId, tokenId) => {
  try {
    await UserToken.create({ userId, tokenId });
  }catch (error) {
    console.error("Error al guardar el token en la base de datos:", error);
    throw new Error("Error al guardar el token en la base de datos.");
  }
}

const listTokens = async (req, res) => {
  const userTokens = await UserToken.findAll({ where: { userId: req.currentUser.id } });
  try {
    const tokenInfos = await Promise.all(userTokens.map(({tokenId}) => {
        return new TokenInfoQuery().setTokenId(tokenId).execute(client);
    }));
    const newTokens = tokenInfos.map((tokenInfo, index) => ({...tokenInfo, tokenId: tokenInfo.tokenId.toString()}));
    res.status(200).json({tokens:newTokens, success: true});
  } catch (error) {
      console.log(error)
      console.error("Error al obtener información de tokens:", error);
      res.status(500).send({ message: "Error al obtener tokens."});
  }
}

module.exports = {
  createToken,
  listTokens
}