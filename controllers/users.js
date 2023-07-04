const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');
const { codeMessage, ERROR_CODES } = require('../errors/errors');

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

const createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, password, email,
    } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      password: hashPassword,
      email,
    });

    res.status(ERROR_CODES.CREATED).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODES.BAD_REQUEST).send({
        message: `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`,
      });
      return;
    }
    res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: codeMessage.serverError });
  }
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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error401('Неправильная почта или пароль');
    }
    const token = jwt.sign({ _id: user._id }, 'asdcqwcqwcdqwcq', { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.send({ message: codeMessage.succes });
  } catch (err) {
    next(err);
  }
};

const getCurentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error404('Пользователя не существует');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatarUser,
  login,
  getCurentUser,
};
