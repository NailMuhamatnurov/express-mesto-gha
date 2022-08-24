const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateAvatar, currentUserInfo,
} = require('../controllers/users');
const { validateUser, validateUserProfile, validateUserAvatar } = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/:userId', validateUser, getUserById);

router.patch('/me', validateUserProfile, updateUser);

router.patch('/me/avatar', validateUserAvatar, updateAvatar);

router.get('/me', currentUserInfo);

module.exports = router;
