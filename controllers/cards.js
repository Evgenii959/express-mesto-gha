const Card = require('../models/card');
const { codeMessage, ERROR_CODES } = require('./errors');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(ERROR_CODES.OK).send(cards))
  .catch(() => {
    res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: codeMessage.serverError });
  });

const createCards = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(ERROR_CODES.CREATED).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: codeMessage.serverError });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: codeMessage.cardNotFound });
        return;
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: codeMessage.falseId });
      } else {
        res
          .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: codeMessage.serverError });
      }
    });
};

const addLikeCard = (req, res) => {
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
        res
          .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: codeMessage.serverError });
      }
    });
};

const deleteLikeCard = (req, res) => Card.findByIdAndUpdate(
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
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: codeMessage.serverError });
    }
  });

module.exports = {
  getCards,
  createCards,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
