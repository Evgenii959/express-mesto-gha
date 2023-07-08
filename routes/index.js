const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const Error404 = require('../errors/error404');

router.use(userRoutes);
router.use(cardRoutes);
router.use((req, res, next) => {
  next(new Error404('Маршрут не найден'));
});

module.exports = router;
