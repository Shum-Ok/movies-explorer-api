const mongoose = require('mongoose');
const { isURL } = require('validator');
// errors
const { messagesError } = require('../utils/const'); // messages

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [isURL, messagesError.validationUrl],
  },
  trailerLink: {
    type: String,
    required: true,
    validate: [isURL, messagesError.validationUrl],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [isURL, messagesError.validationUrl],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
