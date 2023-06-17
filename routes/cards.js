const router = require("express").Router();
const {
    getCards,
    createCards,
    deleteCard,
    addLikeCard,
    deleteLikeCard,
} = require("../controllers/cards");

router.get("/cards", getCards);

router.post("/cards", createCards);

router.delete("/cards/:id", deleteCard);

router.put("/cards/:id/likes", addLikeCard);

router.delete("cards/:id/likes", deleteLikeCard);

module.exports = router;
