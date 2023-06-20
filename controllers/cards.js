const Card = require('../models/card');
const {
  serverError,
  cardNotFound,
  falseId,
  serverOk,
  createdOk,
  badRequest,
  internalServerError,
  notFound,
} = require('./errors');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(serverOk).send(cards))
  .catch(() => {
    res.status(internalServerError).send({ message: serverError });
  });

const createCards = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(createdOk).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      return res.status(internalServerError).send({ message: serverError });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: cardNotFound });
        return;
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(badRequest).send({ message: falseId });
      } else {
        res.status(internalServerError).send({ message: serverError });
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
        return res.status(notFound).send({ message: cardNotFound });
      }
      return res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(badRequest).send({ message: falseId });
      } else {
        res.status(internalServerError).send({ message: serverError });
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
      return res.status(notFound).send({ message: cardNotFound });
    }
    return res.send(card);
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(badRequest).send({ message: falseId });
    } else {
      res.status(internalServerError).send({ message: serverError });
    }
  });

module.exports = {
  getCards,
  createCards,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
