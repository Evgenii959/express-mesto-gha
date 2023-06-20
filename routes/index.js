const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { falseAdress, notFound } = require('../controllers/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res) => {
  res.status(notFound).send({ message: falseAdress });
});

module.exports = router;
