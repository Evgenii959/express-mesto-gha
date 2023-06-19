const User = require('../models/user');
const {
  serverError,
  userNotFound,
  falseId,
  falseData,
} = require('./errors');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => {
    res.status(500).send({ message: serverError });
  });

const getUserById = (req, res) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: userNotFound });
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: falseId });
      } else {
        res.status(500).send({ message: serverError });
      }
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res.status(500).send({ message: serverError });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((newUser) => res.status(200).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: falseData,
        });
      }
      return res.status(500).send({ message: serverError });
    });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((newUser) => res.status(200).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res.status(500).send({ message: serverError });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatarUser,
};
