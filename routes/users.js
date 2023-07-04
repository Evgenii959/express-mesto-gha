const router = require('express').Router();
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

router.get('/users/:id', authMiddle, getUserById);

router.post('/signup', createUser);

router.patch('/users/me', authMiddle, updateUser);

router.get('/users/me', authMiddle, getCurentUser);

router.patch('/users/me/avatar', authMiddle, updateAvatarUser);

router.post('/signin', login);

module.exports = router;
