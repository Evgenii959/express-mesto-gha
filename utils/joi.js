const { Segments, Joi } = require('celebrate');
const validUrl = require('valid-url');

const cardValid = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
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
    id: Joi.string().hex(),
  }),
};

const userValid = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    avatar: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validUrl.isWebUri(value)) {
          return helpers.error("Ошибка");
        }
        return value;
      }),
  }),
};

const userValidUpdate = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
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
  cardValid, cardValidId, userValid, userValidUpdate,
};
