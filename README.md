# Boas vindas ao repositório para o Front End do desafio técnico da ROIT Bank!

A aplicação simula a manipulação de uma lista de usuários. Onde é possível realizar as 4 operações básicas de CRUD (Criar, Ler, Atualizar e Deletar) para cada usuário cadastrado. Para criar o Front End foi utilizado o ReactJS. Para o Back End, o banco de dados é não relacional e foi feito com o MongoDB. A API foi feita usando NodeJS e Express. Para ter acesso à API é necessário token gerado por autentificação JWT.

Este é o repositório para o Back End. O repositório do Front End se encontra no seguinte link: https://github.com/Vitor8/roit-front-end

## Instruções para executar o projeto

1. Primeiramente, para o pleno funcionamento da aplicação, devemos iniciar o back end da aplicação. Para isso:

    1.1 Clone o repositório do Back End: `git clone git@github.com:Vitor8/roit-back-end.git`

    1.2 Entra na pasta do repositório que você acabou de clonar: `cd roit-back-end`

    1.3 Instale as dependências: `npm install`

    1.4 Inicie a aplicação: `node index.js`

    1.5 A aplicação irá rodar na porta `3001`
  
2. Feito o primeiro passo, agora podemos iniciar o Front End. Para isso:

    2.1 Clone o repositório do Front End: `git clone git@github.com:Vitor8/roit-front-end.git`
    
    2.2 Entra na pasta do repositório que você acabou de clonar: `cd roit-front-end`
    
    2.3 Instale as dependências: `npm install`
    
    2.4 Inicie a aplicação: `npm start`
    
    2.5 A aplicação irá rodar na porta `3000`
   
## Estrutura do código

Organizei meu código no seguinte formato. Cada pasta possui os arquivos de acordo com a funcionalidade referente ao nome da pasta. 

![estrutura-back-end](https://user-images.githubusercontent.com/24492328/145211958-5e1ba751-4c31-4b9e-98f6-8d899469c8c5.png)

A autenticação é feita via `JWT`.

##  Todos os meus endpoints estão no padrão REST

- Utilizo verbos HTTP adequados para cada operação.

- URL´s agrupadas e padronizadas para cada recurso.

- Endpoints sempre retornam uma resposta, havendo sucesso nas operações ou não.

## Conexão com o Banco

**⚠️ IMPORTANTE! ⚠️**

Ao clonar o repositório, instale as dependências utilizando o `npm install`.

Para rodar o projeto na sua máquina, é necessário ter o MongoDB instalado. 

Para realizar a conexão com o banco, utilizei os seguintes parâmetros:

```javascript
require('dotenv').config();
const MONGO_DB_URL = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'roit';
```

## Coleção

O banco possui apenas uma coleção de usuários.

O nome da coleção de usuários é: `users`.

Os campos da coleção `users` possuem o formato:

```json
{
	"_id" : ObjectId("61b0936e260cf6869c9aeb2c"),
	"name" : "Ana Giorgiani",
	"age" : "24",
	"gitHubUser" : "anagiorgiani",
	"cep" : "17031410",
	"number" : "100",
	"complement" : "",
	"fullAddress" : {
		"cep" : "17031-410",
		"logradouro" : "Rua 13",
		"complemento" : "",
		"bairro" : "Ferradura Mirim",
		"localidade" : "Bauru",
		"uf" : "SP",
		"ibge" : "3506003",
		"gia" : "2094",
		"ddd" : "14",
		"siafi" : "6219"
	},
	"gitHubData" : {
		"id" : 80549403,
		"avatar" : "https://avatars.githubusercontent.com/u/80549403?v=4",
		"url" : "https://api.github.com/users/anagiorgiani",
		"repos_url" : "https://api.github.com/users/anagiorgiani/repos",
		"html_url" : "https://github.com/anagiorgiani"
	}
}

```
---

## Testes

As principais funcionalidades da API são testadas **automaticamente**. Cada `endpoint` possui vários requisitos. Os testes se encontram no arquivo `roit.test.js` na pasta `test`.

Para executar os testes localmente, digite no terminal o comando `npm test`.

---

# Endpoints

### 1 - Endpoint Login

- A rota é POST (`/login`).

- O body da requisição precisa ter os campos Email e Senha.

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- O retorno da requisição possui o seguinte formato:

  ```json
  {
    "token": "string",
  }
  ```

### 2 - Endpoint Cadastro de usuários

- A rota é POST (`/user`).

- No Header da requisição deve estar o Token válido gerado no momento de Login

- O Body da requisição deve possui o seguinte formato

  ```json
  {
    "user": {
        "...dados do novo usuário"
     }
  }
  ```
  
- Caso o usuário já existir, o endpoint tem o seguinte retorno, com status `409`:

  ```json
  {
    "message": "User already registered"
  }
  
- Caso a usuário for cadastrado, o endpoint tem o seguinte retorno, com status `201`:

  ```json
  {
    "id": "id criado pelo MongoDB"
    "message": "User created successfully",
  }

### 3 - Endpoint Atualização de usuários

- A rota é PUT (`/user`).

- No Header da requisição deve estar o Token válido gerado no momento de Login

- O body da requisição deve possuir o usuário a ser editado, já com os novos dados. O MongoDB irá encontrar o usuário a ser atualizado pelo _id passado no body: 

  ```json
  {
    "user": {
        "_id": "id do usuário a ser editado",
        "...dados do usuário editados"
     }
  }
  ```
- O retorno da requisição segue o seguinte formato, com status `201`:

```json
{
    "messag": "update ok"
}
```

### 4 - Endpoint Consultar todos os usuários

- A rota é GET (`/users`).

- No Header da requisição deve estar o Token válido gerado no momento de Login

- O retorno da requisição possui o seguinte formato, com status `201`:

```json
{
    "users": {
      [
        "user1": {}
        "user2": {}
        "user3": {}
        ...
      ]
    }
}
```
### 6 - Endpoint Consultar usuário pelo Id

- A rota é GET (`/user/:id`)

- No Header da requisição deve estar o Token válido gerado no momento de Login

- O retorno da requisição possui o seguinte formato:

```json
{
    "user": {
      "...dados do usuário requisitados"
    }
}
```

### 7 - Endpoint Deletar usuário pelo Id

- A rota é DELETE (`/user/:id`)

- No Header da requisição deve estar o Token válido gerado no momento de Login
- O retorno da requisição possui o seguinte formato:

```json
{
  "message": "delete OK"
}
```

### 8 - Testes

- Para cada endpoint do projeto, criei uma série de testes utilizando o `Jest`

- Os testes se encontram na pasta `test` no arquivo `roit.test.js`

- Para executar os testes, certifique-se da aplicação já estar rodando com `node index.js`, e digite no terminal o comando `npm test`
