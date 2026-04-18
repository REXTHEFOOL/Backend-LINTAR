const express = require('express');

const booksController = require('./books-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/books', route);

  // Get list of books
  route.get('/', booksController.getBooks);

  // Create a new book
  route.post('/', booksController.createBook);

  route.get('/:id', booksController.getBook);

  route.put('/:id', booksController.updateBook);

  route.delete('/:id', booksController.deleteBook);
};
