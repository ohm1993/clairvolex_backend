import Book from '../models/Book.js';
import moment from 'moment';
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

const updateBookDetails = async (id, updateData) => {
  const [updatedRows] = await Book.update(updateData, {
    where: { id },
  });
  if (updatedRows === 0) {
    return { found: false };
  }
  const updatedBook = await Book.findByPk(id);
  return { found: true, book: updatedBook };
};

const deleteBook = async (id) => {
  const result = await Book.destroy({
    where: { id }
  });
  return result;
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
    const isDate = moment(search, 'YYYY-MM-DD', true).isValid() || moment(search, 'DD-MM-YYYY', true).isValid();
    const normalizedDate = isDate ? moment(search, ['YYYY-MM-DD', 'DD-MM-YYYY']).format('YYYY-MM-DD') : null;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
        { genre: { [Op.like]: `%${search}%` } }
      ];
      if (isDate) {
        where[Op.or].push({ publishedDate: { [Op.eq]: normalizedDate } });
      }
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
  searchBooks,
  updateBookDetails,
  deleteBook
};
