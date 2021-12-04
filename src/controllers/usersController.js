const {
  createUserModel,
} = require('../models/usersModel');

const createUserController = async (req, res) => {
  const { user } = req.body;

  await createUserModel({ user });

  return res.status(201).json({
    message: 'ok'
  });
};

module.exports = {
  createUserController,
};