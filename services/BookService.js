import Book from '../models/Book.js';
import { Op } from 'sequelize';

const getAllBooks = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const books = await Book.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    return {
      total: books.count,
      pages: Math.ceil(books.count / limit),
      currentPage: page,
      books: books.rows,
    };
  } catch (error) {
    throw error;
  }
};

const createBook = async (title, author, publishedDate, genre = null) => {
  try {
    const newBook = await Book.create({ title, author, publishedDate, genre });
    return newBook;
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      throw new Error(errorMessage);
    }
    throw error;
  }
};

const getBookById = async (id) => {
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  } catch (error) {
    throw error;
  }
};

const searchBooks = async ({ search, sortField = 'title', sortOrder = 'ASC', page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
        { publishedDate: { [Op.like]: `%${search}%` } },
        { genre: { [Op.like]: `%${search}%` } }
      ];
    }

    const books = await Book.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortField, sortOrder]],
    });

    return {
      total: books.count,
      pages: Math.ceil(books.count / limit),
      currentPage: page,
      books: books.rows,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getAllBooks,
  createBook,
  getBookById,
  searchBooks
};
