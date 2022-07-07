const router = require('express').Router();

// routers
const userRouter = require('./users');
const movieRouter = require('./movies');

// controllers
const { login, createUser } = require('../controllers/users');

// middlewares
const { validationLogin, validationCreateUser } = require('../middlewares/validations');
const auth = require('../middlewares/auth');

// errors
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth); // авторизация
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (_, res, next) => {
  next(new NotFoundError('Такой URL не найден'));
});

module.exports = router;
