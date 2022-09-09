const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'поле с названием карточки не может быть пустым'],
    minlength: [2, 'название карточки не может быть короче двух символов'],
    maxlength: [30, 'название карточки не может быть длиннее 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'ссылка на фото обязательна'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат ссылки на изображение',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
