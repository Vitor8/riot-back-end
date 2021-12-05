const mongoConnection = require('./connection');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const getUserByGitHubName = async({ gitHubUser }) => {
  const usersCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('users'));

  const user = await usersCollection.findOne({ "gitHubUser": gitHubUser });

  if (user) return true;

  return false;
}

const createUserModel = async ({ user }) => {
  const usersCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('users'));

  const gitHubUser = user["gitHubUser"];

  const userAlreadyRegistered = await getUserByGitHubName({ gitHubUser });

  if (userAlreadyRegistered) return false;

  await usersCollection.insertOne(user);

  return true;
};

const updateUserModel = async({ user }) => {
  await mongoConnection.getConnection()
    .then((db) => {
      return db.collection('users')
        .findOneAndUpdate({ _id: ObjectId(user['id']) }, { $set: user }, { returnOriginal: false })
    });
}

const getAllUsersModel = async() => {
  const usersCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('users'));

  const users = await usersCollection.find().toArray();

  return users;
}

const getUserByIdModel = async({ id }) => {
  const usersCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('users'));

  const user = await usersCollection.findOne({ _id: ObjectId(id) });

  return user;
}

const deleleteUserModel = async({ id }) => {
  const usersCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('users'));

  await usersCollection.deleteOne({ _id: ObjectId(id) });
}

const loginUserModel = async({ email, password }) => {
  const secret = process.env.SECRET;

  const payload = {
    email,
    password,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: '8h',
  });

  return token;
}

module.exports = {
  createUserModel,
  updateUserModel,
  getAllUsersModel,
  getUserByIdModel,
  deleleteUserModel,
  loginUserModel
};