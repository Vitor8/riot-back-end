const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Requisito 12
app.post('/user', createUserController);


module.exports = app;
