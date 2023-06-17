const router = require("express").Router();
const userRoutes = require("./users");
const cardRoutes = require("./cards");

router.use(userRoutes);
router.use(cardRoutes);
router.use((req, res) => {
    res.statusCode(404).send({ message: "Неверный адрес" });
});

module.exports = router;
