const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

// errors
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const { messagesError } = require('../utils/const'); // messages

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, messagesError.validationEmail],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // если НЕнашелся пользователь, отклолняем промис
      if (!user) {
        return Promise.reject(new UnauthorizedError(messagesError.unauthorizedError));
      }
      // если нашелся
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(messagesError.unauthorizedError));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
