const express = require('express');
const mongoose = require('mongoose');
/*
const bodyParser = require('body-parser');
*/

const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');

const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_SERVER_ERROR } = require('./errors/errorsStatus');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
*/
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

app.use('/cards', cardRouter);
app.use('/users', userRouter);

app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(ERROR_CODE_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные' });
  } else if (err.name === 'ValidationError') {
    res.status(ERROR_CODE_BAD_REQUEST)
      .send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
  } else {
    const { statusCode = ERROR_CODE_SERVER_ERROR, message } = err;
    res.status(statusCode)
      .send({ message: statusCode === ERROR_CODE_SERVER_ERROR ? 'На сервере произошла ошибка' : message });
  }
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаем порт ${PORT}`);
});
