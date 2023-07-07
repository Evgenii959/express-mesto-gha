const { Segments, Joi } = require('celebrate');
const validUrl = require('valid-url');

const userValidLogin = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

const cardValid = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({ 'string.empty': 'Строка не должна быть пустой', 'string.min': 'минимальное количество символов 2' }),
    link: Joi.string().required().custom((value, helpers) => {
      if (!validUrl.isWebUri(value)) {
        return helpers.error('Ошибка');
      }
      return value;
    }),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex(),
  }),
};

const cardValidId = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().hex(),
  }),
};

const userValid = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    avatar: Joi.string()
      .custom((value, helpers) => {
        if (!validUrl.isWebUri(value)) {
          return helpers.error('Ошибка');
        }
        return value;
      }),
  }),
};

const userValidId = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().hex(),
  }),
};

const userValidUpdate = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
};

const userValidAvatar = {
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validUrl.isWebUri(value)) {
          return helpers.error('Ошибка');
        }
        return value;
      }),
  }),
};

module.exports = {
  cardValid,
  cardValidId,
  userValid,
  userValidUpdate,
  userValidLogin,
  userValidAvatar,
  userValidId,
};
