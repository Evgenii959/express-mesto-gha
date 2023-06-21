const User = require('../models/user');
const { codeMessage, ERROR_CODES } = require('./errors');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(ERROR_CODES.OK).send(users))
  .catch(() => {
    res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: codeMessage.serverError });
  });

const getUserById = (req, res) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: codeMessage.userNotFound });
      }
      return res.status(ERROR_CODES.OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: codeMessage.falseId });
      } else {
        res
          .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: codeMessage.serverError });
      }
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => res.status(ERROR_CODES.CREATED).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: codeMessage.serverError });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((newUser) => res.status(ERROR_CODES.OK).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: codeMessage.falseData,
        });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: codeMessage.serverError });
    });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((newUser) => res.status(ERROR_CODES.OK).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: codeMessage.serverError });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatarUser,
};
