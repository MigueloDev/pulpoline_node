const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/Users');
const _secret = process.env.SECRET_KEY

const register = async ({name, email, password}, res) => {
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const jwtToken = jwt.sign({ id: newUser.id, username: newUser.username }, _secret, { expiresIn: '3m' });
    const refreshToken = jwt.sign({ id: newUser.id, username: newUser.username }, _secret, { expiresIn: '5m' });

    await newUser.update({ token: refreshToken });

    res.status(201)
      .json({
        user: newUser,
        token: jwtToken,
        refreshToken: refreshToken,
        success: true,
        message: 'Usuario creado exitosamente'
      });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
}

const logout = async (req, res) => {
  const { id } = req.currentUser;
  const user = await User.findOne({ where: { id: id } });
  user.token = null;
  await user.save();
  res.json({ message: 'Logout successful' });
}

const login = async ({email, password}, res) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const passwordMatch = await bcrypt.compare(password, user?.password);
    if (!user || !passwordMatch) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const jwtToken = jwt.sign({ id: user.id, username: user.username }, _secret, { expiresIn: '3m' });
    const refreshToken = jwt.sign({ id: user.id, username: user.username }, _secret, { expiresIn: '5m' });
    await user.update({ token: refreshToken });

    res.status(200)
      .json({
        message: 'Login successful',
        user: user,
        token: jwtToken,
        refreshToken: refreshToken,
        success: true
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
}

const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Token is required' });
  }
  try {

    jwt.verify(refreshToken, _secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized', code_message: 'unable_to_refresh_token' });
      }
      const newUser = await User.findOne({ where: { id: decoded.id } });
      const jwtToken = jwt.sign({ id: newUser.id, username: newUser.username }, _secret, { expiresIn: '3m' });
      const refreshToken = jwt.sign({ id: newUser.id, username: newUser.username }, _secret, { expiresIn: '10m' });
      await newUser.update({ token: refreshToken });

      return res.status(200).json({ token: jwtToken, refreshToken: refreshToken, success: true });
    });
  }catch(error){
    return res.status(401).json({ message: 'Token is required' });
  }
}

module.exports = {
  login,
  logout,
  register,
  refreshToken
}