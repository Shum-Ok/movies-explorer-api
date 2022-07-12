const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

// errors
const ValidationError = require('../errors/ValidationError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409
const { messagesError } = require('../utils/const'); // messages

const MONGO_DUPLICATE_KEY_CODE = 11000;

// salt
const saltRounds = 10;

// Регистрация пользователя
const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  return bcrypt.hash(password, saltRounds)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then(() => {
          res.status(200).send({
            email,
            name,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new ValidationError(messagesError.validation);
          }
          if (err.code === MONGO_DUPLICATE_KEY_CODE) {
            next(new ConflictError(messagesError.conflict));
          }
          next(err);
        });
    })
    .catch(next);
};

// авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`, { expiresIn: '7d' }); // создали токен
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError(messagesError.unauthorizedError));
    });
};

// Получить свои данные
const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// Обновить профиль Юзера PATCH
const patchUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(messagesError.notFoundUserID);
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError(messagesError.validation));
      }
      if (err.code === MONGO_DUPLICATE_KEY_CODE) {
        next(new ConflictError(messagesError.conflict));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  patchUser,
  login,
  getUserMe,
};
