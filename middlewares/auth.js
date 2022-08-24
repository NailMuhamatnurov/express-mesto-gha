const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { cookies } = req;
  const authorization = cookies.token;

  if (!authorization) {
    return next(new AuthError('Токен остутствует или некорректен'));
  }

  const token = authorization;

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthError('Токен не верифицирован, авторизация не пройдена'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
