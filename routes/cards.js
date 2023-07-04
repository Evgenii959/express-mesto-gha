const router = require('express').Router();
const { celebrate } = require('celebrate');
const { cardValid, cardValidId } = require('../utils/joi');
const authMiddle = require('../middlewares/auth');
const {
  getCards,
  createCards,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', authMiddle, getCards);

router.post('/cards', authMiddle, celebrate(cardValid), createCards);

router.delete('/cards/:id', authMiddle, celebrate(cardValidId), deleteCard);

router.put('/cards/:id/likes', authMiddle, celebrate(cardValidId), addLikeCard);

router.delete('/cards/:id/likes', authMiddle, deleteLikeCard);

module.exports = router;
