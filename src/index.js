const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3500;
const app = express();

const authRoutes = require('./v1/routes');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use('/api/v1', authRoutes);
const sequelize = require('./database/connection');
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});