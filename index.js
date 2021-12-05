const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());

const port = 3001;

const {
  createUserController,
  updateUserController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  loginUserController
} = require('./src/controllers/usersController');

const {
  isTokenValid
} = require('./src/validations/isDataValid');

app.post('/login', loginUserController);

app.post('/user', isTokenValid, createUserController);

app.put('/user', isTokenValid, updateUserController);

app.get('/users', isTokenValid, getAllUsersController);

app.get('/user/:id', isTokenValid, getUserByIdController);

app.delete('/user/:id', isTokenValid, deleteUserController);

app.listen(port, () => {
  console.log(`Aplicação ouvindo na porta ${port}`);
});

module.exports = app;