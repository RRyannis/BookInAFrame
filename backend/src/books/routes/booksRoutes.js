const express = require('express');
const { getBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/booksController');

const router = express.Router();

router.get('/books', getBooks);
router.get('/books/:id', getBook);
router.post('/books', createBook);
router.patch('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

module.exports = router;