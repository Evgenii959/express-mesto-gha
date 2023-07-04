const jwt = require('jsonwebtoken');
const Error401 = require('../errors/error401');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new Error401('Токен не найден');
  }
  try {
    req.user = jwt.verify(token, 'asdcqwcqwcdqwcq');
    next();
  } catch (err) {
    next(new Error401('Токен не найден'));
  }
};

module.exports = authMiddleware;
