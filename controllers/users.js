const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const UserExistError = require('../errors/userExistError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users.map((user) => {
        const {
          name,
          about,
          avatar,
          _id,
        } = user;
        return {
          _id,
          name,
          about,
          avatar,
        };
      }));
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!password || password.length < 4) {
    throw new ValidationError('Пароль отсутствует или короче четырех символов');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user.toJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        next(new UserExistError('Пользователь с таким email уже существует'));
      }
      next(err);
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные id пользователя'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('token', token, {
          maxAge: 604800000,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      next(err);
    });
};

const currentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers, createUser, getUserById, updateUser, updateAvatar, login, currentUserInfo,
};
