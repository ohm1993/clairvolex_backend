import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty.'
      }
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Author cannot be empty.'
      }
    }
  },
  publishedDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Published Date cannot be empty.'
      },
      isDate: {
        msg: 'Published Date must be a valid date.'
      }
    }
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'Genre must be less than 50 characters long.'
      }
    }
  }
});

export default Book;
