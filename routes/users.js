const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  userValid,
  userValidUpdate,
  userValidLogin,
  userValidAvatar,
  userValidId,
} = require('../utils/joi');
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

router.get('/users/me', authMiddle, getCurentUser);

router.get('/users/:id', authMiddle, celebrate(userValidId), getUserById);

router.post('/signup', celebrate(userValid), createUser);

router.patch('/users/me', authMiddle, celebrate(userValidUpdate), updateUser);

router.patch(
  '/users/me/avatar',
  authMiddle,
  celebrate(userValidAvatar),
  updateAvatarUser,
);

router.post('/signin', celebrate(userValidLogin), login);

module.exports = router;
