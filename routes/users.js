const router = require('express').Router();
const { celebrate } = require('celebrate');
const { userValid, userValidUpdate } = require('../utils/joi');
const authMiddle = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatarUser,
  login,
  getCurentUser,
} = require('../controllers/users');

router.get('/users', authMiddle, getUsers);

router.get('/users/:id', authMiddle, celebrate(userValid), getUserById);

router.post('/signup', celebrate(userValid), createUser);

router.patch('/users/me', authMiddle, celebrate(userValidUpdate), updateUser);

router.get('/users/me', authMiddle, getCurentUser);

router.patch('/users/me/avatar', authMiddle, celebrate(userValidUpdate), updateAvatarUser);

router.post('/signin', celebrate(userValid), login);

module.exports = router;
