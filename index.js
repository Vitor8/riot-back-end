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
  deleteUserController
} = require('./src/controllers/usersController');

app.post('/user', createUserController);

app.put('/user', updateUserController);

app.get('/users', getAllUsersController);

app.get('/user/:id', getUserByIdController);

app.delete('/user/:id', deleteUserController);

app.listen(port, () => {
  console.log(`Aplicação ouvindo na porta ${port}`);
});

module.exports = app;