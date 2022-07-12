const router = require('express').Router();
const { validationDeleteMovie, validationCreateMovie } = require('../middlewares/validations');

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movie');

// Получить все фильмы
router.get('/', getMovies);

// Создать фильм
router.post('/', validationCreateMovie, createMovie);

// Удалить фильм
router.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;
