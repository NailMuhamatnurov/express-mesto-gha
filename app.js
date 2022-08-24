const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const router = require('./routes/index');

const { ERROR_CODE_SERVER_ERROR } = require('./errors/errorsStatus');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(router);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_CODE_SERVER_ERROR, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === ERROR_CODE_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаем порт ${PORT}`);
});
