const frisby = require('frisby');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
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

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await db.collection('users').deleteMany({});
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

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await db.collection('users').deleteMany({});
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

  it('Será validado que não é possível fazer post de usuário se token for inválido', async () => {
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

describe('3 - Testa endpoint put "/user"', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('riot');
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await db.collection('users').deleteMany({});
    await connection.close();
  });

  it('Será validado que não é possível atualizar usuário se token não for informado', async () => {
    await frisby
    .setup({
      request: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    })
    .put(`${url}/user`)
    .expect('status', 401)
    .then((response) => {
      const { body } = response;
      result = JSON.parse(body);
      expect(result.message).toBe('missing auth token');
    });
  });

  it('Será validado que não é possível atualizar usuário se token for não for válido', async () => {
    await frisby
    .setup({
      request: {
        headers: {
          Authorization: '123456',
          'Content-Type': 'application/json',
        },
      },
    })
    .put(`${url}/user`)
    .expect('status', 401)
    .then((response) => {
      const { body } = response;
      result = JSON.parse(body);
      expect(result.message).toBe('jwt malformed');
    });
  });

  it('Será validado que é possível atualizar usuário estando autentificado', async () => {
    let result;
    let resultUser;

    await frisby
      .post(`${url}/login/`, {
        email: 'erickjacquin@gmail.com',
        password: '12345678',
      })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
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
              name: 'Gabriel',
            }
          })
          .expect('status', 201)
          .then((responseRecipes) => {
            const { body } = responseRecipes;
            resultUser = JSON.parse(body);
          });
      });

    // Observação: A partir daqui ocorre um erro que não consegui resolver
    await frisby
      .setup({
        request: {
          headers: {
            Authorization: result.token,
            'Content-Type': 'application/json',
          },
        },
      })
      .put(`${url}/user`, {
        user: {
          id: resultUser['id'],
          name: 'Gabriel Felipe',
        }
      })
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        expect(result.message).toBe('update ok');
      });
  });
});

describe('4 - Testa endpoint get "/users', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('riot');
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await db.collection('users').deleteMany({});
    await connection.close();
  });

  it('Será validado que não é possível visualizar usuários se token não for informado', async () => {
    await frisby
      .setup({
        request: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
      .get(`${url}/users`)
      .expect('status', 401)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        expect(result.message).toBe('missing auth token');
      });
  });

  it('Será validado que não é possível visualizar usuários se token for inválido', async () => {
    await frisby
    .setup({
      request: {
        headers: {
          Authorization: '123456',
          'Content-Type': 'application/json',
        },
      },
    })
    .get(`${url}/users`)
    .expect('status', 401)
    .then((response) => {
      const { body } = response;
      result = JSON.parse(body);
      expect(result.message).toBe('jwt malformed');
    });
  });

  it('Será válidado que é possível visualizar todos os usuários cadastrados', async () => {  
    let result;
    
    await frisby
      .post(`${url}/login/`, {
        email: 'vitor@email.com',
        password: 'admin',
      })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
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

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: result.token,
            'Content-Type': 'application/json',
          },
        },
      })
      .get(`${url}/users`)
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        expect(result.users).not.toBeNull();
      });
  })
});

describe('5 - Testa endpoint get "/user/id"', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('riot');
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await db.collection('users').deleteMany({});
    await connection.close();
  });

  it('Será validado que não é possível visualizar usuário se token não for informado', async () => {
    let result;
    let resultUser = {};
    
    await frisby
      .post(`${url}/login/`, {
        email: 'vitor@email.com',
        password: 'admin',
      })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
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
            resultUser['id'] = json.id;
            expect(json.message).toBe('User created successfully');
          });
      });

    const idUser = resultUser['id'];

    await frisby
      .setup({
        request: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
      .get(`${url}/user/${idUser}`)
      .expect('status', 401)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        expect(result.message).toBe('missing auth token');
      });
  });

  it('Será validado que não é possível visualizar usuário se token for não for válido', async () => {
    let result;
    let resultUser = {};
    
    await frisby
      .post(`${url}/login/`, {
        email: 'vitor@email.com',
        password: 'admin',
      })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
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
            resultUser['id'] = json.id;
            expect(json.message).toBe('User created successfully');
          });
      });

    const idUser = resultUser['id'];

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: '123456',
            'Content-Type': 'application/json',
          },
        },
      })
      .get(`${url}/user/${idUser}`)
      .expect('status', 401)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        expect(result.message).toBe('jwt malformed');
      });
  });

  it('Será validado que é possível visualizar o usuário requerido', async () => {
    let result;
    let resultUser = {};
    
    await frisby
      .post(`${url}/login/`, {
        email: 'vitor@email.com',
        password: 'admin',
      })
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
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
            resultUser['id'] = json.id;
            expect(json.message).toBe('User created successfully');
          });
      });

    const idUser = resultUser['id'];

    await frisby
      .setup({
        request: {
          headers: {
            Authorization: result.token,
            'Content-Type': 'application/json',
          },
        },
      })
      .get(`${url}/user/${idUser}`)
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        expect(result.user).not.toBeNull();
        expect(result.user.name).toBe('Vitor Hugo');
      });
  });
});