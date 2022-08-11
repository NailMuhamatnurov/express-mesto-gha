const express = require('express');
const mongoose = require('mongoose');

const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');

const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_SERVER_ERROR = 500;

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '62f34d44b8cbf5d379ffc78b',
  };
  next();
});

app.use(cardRouter, userRouter);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Отправлен некорректный запрос к серверу' });
  }
  if (err.name === 'NotFoundError') {
    res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Страница не найдена' });
  }
  if (err.name === 'ServerError') {
    res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Сервер не может выполнить запрос' });
  }
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаем порт ${PORT}`);
});
