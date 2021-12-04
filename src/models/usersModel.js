const mongoConnection = require('./connection');
const { ObjectId } = require('mongodb');

const createUserModel = async ({ user }) => {
  const usersCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('users'));

  await usersCollection.insertOne(user);

  return true;
};

const updateUserModel = async({ user }) => {
  const usersCollection = await mongoConnection.getConnection()
    .then((db) => {
      return db.collection('users')
        .findOneAndUpdate({ 'github-user': user['github-user'] }, { $set: user }, { returnOriginal: false })
        .then((result) => result.value);
    });

  return usersCollection;
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

module.exports = {
  createUserModel,
  updateUserModel,
  getAllUsersModel,
  getUserByIdModel,
  deleleteUserModel
};