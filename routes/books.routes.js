import express from 'express';
import BooksService from '../services/BookService.js';
const moment = require('moment');
const router = express.Router();


router.get('/books', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const books = await BooksService.getAllBooks(parseInt(page), parseInt(limit));
    res.status(200).json({ status: 'success', data: books });
  } catch (error) {
    console.log("get api error is",error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/books', async (req, res) => {
  try {
    const { title, author, publishedDate, genre } = req.body;
    if (!title || !author || !publishedDate) {
      return res.status(400).json({message: 'Title, author, and published date are required fields.'});
    }
    const isoDate = moment.utc(publishedDate, 'DD-MM-YYYY', true).toISOString();
    const newBook = await BooksService.createBook(title, author, isoDate, genre);
    res.status(201).json({ status: 'success', data: newBook });
  } catch (error) {
    console.log("post api error is",error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/books/search', async (req, res) => {
  try {
    const { search, sortField = 'title', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;
    const books = await BooksService.searchBooks({ 
      search,
      sortField, 
      sortOrder, 
      page: parseInt(page), 
      limit: parseInt(limit) 
    });
    res.status(200).json({ status: 'success', data: books });
  } catch (error) {
    console.log("searh error is",error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await BooksService.getBookById(bookId);
    res.status(200).json({ status: 'success', data: book });
  } catch (error) {
    console.log("searh by id error is",error);
    res.status(404).json({ status: 'error', message: error.message });
  }
});



module.exports = router;
