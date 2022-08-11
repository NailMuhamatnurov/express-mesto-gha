const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR } = require('../errors/errorsStatus');

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getUserById = async (req, res) => {
  try {
    const findedUser = await User.findById(req.params.userId);
    if (!findedUser) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: findedUser });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: err.message });
    } else if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некоректные данные' });
    } else {
      res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Сервер не отвечает' });
    }
  }
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports = {
  getUsers, createUser, getUserById, updateUser, updateAvatar,
};
