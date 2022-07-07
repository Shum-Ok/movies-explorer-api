const Movie = require('../models/movie');

// errors
const ValidationError = require('../errors/ValidationError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404
const { messagesError } = require('../utils/const'); // messages

// Создать фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send({
      _id: movie._id,
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailerLink: movie.trailerLink,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(messagesError.validation));
      }
      return next(err);
    });
};

// Возвратить все фильмы
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError(messagesError.notFound);
      }
      res.status(201).send(movies);
    })
    .catch(next);
};

// Удалить фильм
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const owner = req.user._id;

  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError(messagesError.notFoundMovieID);
    })
    .then((movie) => {
      if (movie.owner.toString() === owner) {
        return movie.remove()
          .then((deletedMovie) => res.status(201).send(deletedMovie))
          .catch(next);
      }
      throw new ForbiddenError(messagesError.forbidden);
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
