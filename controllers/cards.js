const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');

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

const deleteCard = async (req, res) => {
  try {
    const findedCard = Card.findByIdAndRemove(req.params.cardId);
    if (!findedCard) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.send({ data: findedCard });
  } catch (err) {
    res.send(`Ошибка ${err.name}`);
  }
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
    res.send(`Ошибка ${err.name}`);
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
    res.send(`Ошибка ${err.name}`);
  }
};

module.exports = {
  createCard, getCard, deleteCard, likeCard, dislikeCard,
};
