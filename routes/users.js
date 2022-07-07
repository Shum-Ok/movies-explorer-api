const router = require('express').Router();
const { validationPatchUser } = require('../middlewares/validations');

const {
  patchUser,
  getUserMe,
} = require('../controllers/users');

// Получить свои данные
router.get('/me', getUserMe);

// Обновить профиль Юзера
router.patch('/me', validationPatchUser, patchUser);

module.exports = router;
