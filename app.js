const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  family: 4,
}).then(() => {
  console.log('Подключен');
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Ser running ${PORT}`);
});
