const frisby = require('frisby');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoDbUrl = 'mongodb://127.0.0.1:27017';
const url = 'http://localhost:3001';

describe('1 - Testa endpoint post "/login"', () => {
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

describe('2 - Testa endpoint post "/user"', () => {
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

  it('Será validado que não é possível fazer post de usuário se token não for informado', async () => {
    await frisby
      .setup({
        request: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/user`, {
        user: {
          name: "Vitor"
        }
      })
      .expect('status', 401)
      .then((responseLogin) => {
        const { json } = responseLogin;
        expect(json.message).toBe('missing auth token');
      });
  });

  it('Será validado que não é possível fazer post de usuário se o token não for válido', async () => {
    await frisby
      .setup({
        request: {
          headers: {
            'Authorization': '6437658488',
            'Content-Type': 'application/json',
          },
        },
      })
      .post(`${url}/user`, {
        user: {
          name: "Vitor"
        }
      })
      .expect('status', 401)
      .then((responseLogin) => {
        const { json } = responseLogin;
        expect(json.message).toBe('jwt malformed');
      });
  });

  it('Será validado que é possível cadastrar um novo usuário', async () => {
    await frisby
      .post(`${url}/login/`, {
        email: 'vitor@email.com',
        password: 'admin',
      })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        const result = JSON.parse(body);
        return frisby
          .setup({
            request: {
              headers: {
                Authorization: result.token,
                'Content-Type': 'application/json',
              },
            },
          })
          .post(`${url}/user`, {
            user: {
              name: "Vitor Hugo"
            }
          })
          .expect('status', 201)
          .then((responseLogin) => {
            const { json } = responseLogin;
            expect(json.message).toBe('User created successfully');
          });
      });
  })
});