const router = require('express').Router();

const { auth } = require('../middlewares/auth');
const { validateSignup, validateSignin } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');

const cardRouter = require('./cards');
const userRouter = require('./users');
const NotFoundError = require('../errors/notFoundError');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.get('/logout', (req, res) => {
  res.clearCookie('token').send();
});

router.use((req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс по адресу '${req.path}' не найден`));
});

module.exports = router;
