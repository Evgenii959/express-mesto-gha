const Card = require('../models/card');
const { codeMessage, ERROR_CODES } = require('../errors/errors');
const Error404 = require('../errors/error404');
const Error403 = require('../errors/error403');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(ERROR_CODES.OK).send(cards))
  .catch((err) => {
    next(err);
  });

const createCards = async (req, res, next) => {
  try {
    const { name, link } = req.body;

    const newCard = await Card.create({ name, link, owner: req.user._id });
    if (!newCard) {
      throw new Error404('Карточка не создана');
    }
    res.status(ERROR_CODES.CREATED).send(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODES.BAD_REQUEST).send({
        message: `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`,
      });
    }
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const card = await Card.findById(id);

    if (!card) {
      throw new Error404('Нет карточки с таким id');
    }

    if (card.owner.toString() !== userId) {
      throw new Error403('У вас нет прав');
    }

    await Card.findByIdAndRemove(id);
    res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: codeMessage.falseId });
    } else {
      next(error);
    }
  }
};

const addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: codeMessage.cardNotFound });
      }
      return res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: codeMessage.falseId });
      } else {
        next(error);
      }
    });
};

const deleteLikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: codeMessage.cardNotFound });
    }
    return res.send(card);
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: codeMessage.falseId });
    } else {
      next(error);
    }
  });

module.exports = {
  getCards,
  createCards,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
