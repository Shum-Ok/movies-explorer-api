const {
  dbMovies = 'mongodb://localhost:27017/moviesdb',
  PORT = 3000,
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = {
  dbMovies, PORT, NODE_ENV, JWT_SECRET,
};
