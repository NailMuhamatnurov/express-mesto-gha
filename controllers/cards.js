const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR } = require('../errors/errorsStatus');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const getCard = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const likeCard = async (req, res) => {
  try {
    // eslint-disable-next-line max-len
    const findedLike = Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true });
    if (!findedLike) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.send({ data: findedLike });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: err.message });
    } else if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некоректные данные' });
    } else {
      res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Сервер не отвечает' });
    }
  }
};

const dislikeCard = (req, res) => {
  try {
    // eslint-disable-next-line max-len
    const findedLike = Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true });
    if (!findedLike) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.send({ data: findedLike });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: err.message });
    } else if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некоректные данные' });
    } else {
      res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Сервер не отвечает' });
    }
  }
};

module.exports = {
  createCard, getCard, deleteCard, likeCard, dislikeCard,
};
