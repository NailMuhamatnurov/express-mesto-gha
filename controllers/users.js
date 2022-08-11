const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');

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
    res.send(`Ошибка ${err.name}`);
  }
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports = {
  getUsers, createUser, getUserById, updateUser, updateAvatar,
};
