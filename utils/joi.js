const { Segments, Joi } = require('celebrate');
const validUrl = require('valid-url');

const userValidLogin = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'Строка не должна быть пустой',
      'string.email': 'Некорректный email',
    }),
    password: Joi.string().required().min(8).messages({
      'string.empty': 'Строка не должна быть пустой',
      'string.min': 'минимальное количество символов 8',
    }),
  }),
};

const cardValid = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.empty': 'Строка не должна быть пустой',
        'string.min': 'минимальное количество символов 2',
        'string.max': 'максимальное количество символов 30',
      }),
    link: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validUrl.isWebUri(value)) {
          return helpers.error('Ошибка');
        }
        return value;
      })
      .messages({
        'string.empty': 'Строка не должна быть пустой',
        'string.uri': 'Не допустимый URL',
      }),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).messages({
      'string.empty': 'Строка не должна быть пустой',
      'string.hex': 'Должно содержать 16 символов',
    }),
  }),
};

const cardValidId = {
  [Segments.PARAMS]: Joi.object()
    .keys({
      id: Joi.string().required().length(24).hex(),
    })
    .messages({
      'string.empty': 'Строка не должна быть пустой',
      'string.hex': 'Должно содержать 16 символов',
    }),
};

const userValid = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'минимальное количество символов 2',
      'string.max': 'максимальное количество символов 30',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'минимальное количество символов 2',
      'string.max': 'максимальное количество символов 30',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'Строка не должна быть пустой',
      'string.email': 'Некорректный email',
    }),
    password: Joi.string().required().min(8).messages({
      'string.empty': 'Строка не должна быть пустой',
      'string.min': 'минимальное количество символов 8',
    }),
    avatar: Joi.string()
      .custom((value, helpers) => {
        if (!validUrl.isWebUri(value)) {
          return helpers.error('Ошибка');
        }
        return value;
      })
      .messages({
        'string.uri': 'Не допустимый URL',
      }),
  }),
};

const userValidId = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }).messages({
    'string.empty': 'Строка не должна быть пустой',
    'string.hex': 'Должно содержать 16 символов',
  }),
};

const userValidUpdate = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.empty': 'Строка не должна быть пустой',
        'string.min': 'минимальное количество символов 2',
        'string.max': 'максимальное количество символов 30',
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'string.empty': 'Строка не должна быть пустой',
        'string.min': 'минимальное количество символов 2',
        'string.max': 'максимальное количество символов 30',
      }),
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
      }).messages({
        'string.empty': 'Строка не должна быть пустой',
        'string.uri': 'Не допустимый URL',
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
