const router = require('express').Router();
const {
  createCard, getCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCard);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:catdId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
