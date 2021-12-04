const mongoConnection = require('./connection');

const createUserModel = async ({ user }) => {

  const usersCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('users'));

  await usersCollection.insertOne(user);

  return true;
};

module.exports = {
  createUserModel,
};