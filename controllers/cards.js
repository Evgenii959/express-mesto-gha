const Card = require("../models/card");

const getCards = (req, res) => Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
        res.status(500).send({ message: "Server Error" });
    });

const createCards = (req, res) => {
    const { name, link } = req.body;
    if (!name || !link) {
        res.status(400).send({ message: "Card not found" });
        return;
    }
    Card.create({ name, link, owner: req.user._id })
        .then((newCard) => res.status(201).send(newCard))
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(400).send({
                    message: `${Object.values(err.errors)
                        .map((error) => error.message)
                        .join(", ")}`,
                });
            }
            return res.status(500).send({ message: "Server Error" });
        });
};

const deleteCard = (req, res) => {
    const { id } = req.params;
    Card.findByIdAndRemove(id)
        .then((card) => {
            if (!card) {
                res.status(404).send({ message: "Card not found" });
                return;
            }
            res.send(card);
        })
        .catch((error) => {
            if (error.name === "CastError") {
                res.status(400).send({ message: "false ID" });
            } else {
                res.status(500).send({ message: "Server Error" });
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
                return res.status(404).send({ message: "Card not found" });
            }
            return res.send(card);
        })
        .catch((error) => {
            if (error.name === "CastError") {
                res.status(400).send({ message: "false ID" });
            } else {
                res.status(500).send({ message: "Server Error" });
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
            return res.status(404).send({ message: "Card not found" });
        }
        return res.send(card);
    })
    .catch((error) => {
        if (error.name === "CastError") {
            res.status(400).send({ message: "false ID" });
        } else {
            res.status(500).send({ message: "Server Error" });
        }
    });

module.exports = {
    getCards,
    createCards,
    deleteCard,
    addLikeCard,
    deleteLikeCard,
};
