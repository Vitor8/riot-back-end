const frisby = require('frisby');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoDbUrl = 'mongodb://127.0.0.1:27017';
const url = 'http://localhost:3001';

describe('1 - Testa endpoint "/login"', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('riot');
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que é possível fazer login com sucesso', async () => {
    await frisby
      .post(`${url}/login`,
        {
          email: "v@gmail.com",
          password: '12345678',
        })
      .expect('status', 200)
      .then((responseLogin) => {
        const { json } = responseLogin;
        expect(json.token).not.toBeNull();
      });
  });
});

