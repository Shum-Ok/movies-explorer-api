require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { validationCreateUser, validationLogin } = require('./middlewares/validations');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { userRouter } = require('./routes/users');
const { movieRouter } = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb');

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(cors);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// Логгер запросов нужно подключить до всех обработчиков роутов:
app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use(auth); // авторизация
app.use('/users', userRouter);
app.use('/movies', movieRouter);
app.use('/', (_, res, next) => {
  next(new NotFoundError('Такой URL не найден'));
});

// errorLogger нужно подключить после обработчиков роутов и до обработчиков ошибок:
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(error); // мой обработчий ошибок

app.listen(PORT);
