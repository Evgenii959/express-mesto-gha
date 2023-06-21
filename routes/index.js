const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { codeMessage, ERROR_CODES } = require('../controllers/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: codeMessage.falseAdress });
});

module.exports = router;
