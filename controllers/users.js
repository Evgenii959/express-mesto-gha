const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error400 = require('../errors/error400');
const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');
const { codeMessage, ERROR_CODES } = require('../errors/errors');
const { errorHandler } = require('../middlewares/errorHandler');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(ERROR_CODES.OK).send(users))
  .catch(() => {
    next(errorHandler('Server Error'));
  });

const getUserById = (req, res, next) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        next(new Error404('User not found'));
      }
      return res.status(ERROR_CODES.OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new Error404('false ID'));
      } else {
        next(errorHandler('Server Error'));
      }
    });
};

const createUser = async (req, res, next) => {
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
    if (!user) {
      next(new Error404('Пользователь не создан'));
      return;
    }
    res
      .status(ERROR_CODES.CREATED)
      .send({
        name, about, avatar, email,
      });
  } catch (err) {
    if (err.code === 11000) {
      next(new Error409('Такой email уже существует'));
      return;
    }
    next(err);
  }
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((newUser) => res.status(ERROR_CODES.OK).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400('Переданы не корректные данные'));
      }
      return next(errorHandler('Server Error'));
    });
};

const updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((newUser) => res.status(ERROR_CODES.OK).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400('ValidationError'));
      }
      return next(errorHandler('Server Error'));
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
