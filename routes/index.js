const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { falseAdress } = require('../controllers/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res) => {
  res.status(404).send({ message: falseAdress });
});

module.exports = router;
