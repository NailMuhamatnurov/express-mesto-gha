const router = require('express').Router();
const { validateUser, validateUserProfile, validateUserAvatar } = require('../middlewares/validation');
const {
  getUsers, getUserById, updateUser, updateAvatar, currentUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', currentUserInfo);

router.get('/:userId', validateUser, getUserById);

router.patch('/me', validateUserProfile, updateUser);

router.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
