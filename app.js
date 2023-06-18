const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const routes = require("./routes/index");

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
    family: 4,
}).then(() => {
    console.log("Подключен");
});

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use((req, res, next) => {
    req.user = {
        _id: "648a200185640189dbfd4ece", // вставьте сюда _id созданного в предыдущем пункте пользователя
    };

    next();
});

app.use(routes);

app.listen(PORT, () => {
    console.log(`Ser running ${PORT}`);
});
