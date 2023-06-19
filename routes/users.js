const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatarUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

router.post('/users', createUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatarUser);

module.exports = router;
