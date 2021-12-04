const {
  createUserModel,
  updateUserModel,
  getAllUsersModel,
  getUserByIdModel,
  deleleteUserModel
} = require('../models/usersModel');

const createUserController = async (req, res) => {
  const { user } = req.body;

  await createUserModel({ user });

  return res.status(201).json({
    message: 'ok'
  });
};

const updateUserController = async(req, res) => {
  const { user } = req.body;

  await updateUserModel({ user });

  return res.status(201).json({
    message: 'update ok'
  });
}

const getAllUsersController = async(req, res) => {
  const users = await getAllUsersModel();

  return res.status(201).json({
    users
  });
}

const getUserByIdController = async(req, res) => {
  const { id } = req.params;

  const user = await getUserByIdModel({ id });

  return res.status(201).json({ user });
}

const deleteUserController = async(req, res) => {
  const { id } = req.params;

  await deleleteUserModel({ id });

  return res.status(201).json({ 'message': 'delete ok' });
}

module.exports = {
  createUserController,
  updateUserController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController
};