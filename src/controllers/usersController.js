const {
  createUserModel,
  updateUserModel,
  getAllUsersModel,
  getUserByIdModel,
  deleleteUserModel,
  loginUserModel
} = require('../models/usersModel');

const createUserController = async (req, res) => {
  const { user } = req.body;

  const newUser = await createUserModel({ user });

  if (!newUser) {
    return res.status(409).json({
      message: 'User already registered',
    });
  }

  return res.status(201).json({
    message: 'User created successfully',
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

const loginUserController = async(req, res) => {
  const { email, password } = req.body;

  const token = await loginUserModel({ email, password });

  return res.status(200).json({
    token,
  });
}

module.exports = {
  createUserController,
  updateUserController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  loginUserController
};