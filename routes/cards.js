const router = require('express').Router();
const authMiddle = require('../middlewares/auth');
const {
  getCards,
  createCards,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', authMiddle, getCards);

router.post('/cards', authMiddle, createCards);

router.delete('/cards/:id', authMiddle, deleteCard);

router.put('/cards/:id/likes', authMiddle, addLikeCard);

router.delete('/cards/:id/likes', authMiddle, deleteLikeCard);

module.exports = router;
