require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
// routes
const routes = require('./routes');
// middlewares
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rate-limiter');
// utils
const { PORT, dbMovies } = require('./utils/config');

const app = express();

// Логгер запросов нужно подключить до всех обработчиков роутов:
app.use(requestLogger); // подключаем логгер запросов

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cors);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', routes);

// errorLogger нужно подключить после обработчиков роутов и до обработчиков ошибок:
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(error); // мой обработчий ошибок

mongoose.connect(dbMovies, () => {
  console.log(`Connect DB to ${dbMovies}`);
});
app.listen(PORT, () => {
  console.log(`Start Server:${PORT}`);
});
