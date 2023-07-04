const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { codeMessage, ERROR_CODES } = require('../errors/errors');

router.use(userRoutes);
router.use(cardRoutes);
router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: codeMessage.falseAdress });
});

module.exports = router;
