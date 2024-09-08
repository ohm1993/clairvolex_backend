import { DataTypes } from 'sequelize';
import bcrypt from "bcrypt";
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty.'
      },
      len: {
        args: [3, 20],
        msg: 'Name must be between 3 and 20 characters long.'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email must be unique.'
    },    
    validate: {
      notEmpty: {
        msg: 'Email cannot be empty.'
      },
      isEmail: {
        msg: 'Email must be a valid email address.'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password cannot be empty.'
      },
      len: {
        args: [6, 255],
        msg: 'The password must contain at least 6 characters.'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: {
        args: [['admin', 'user']],
        msg: 'Role must be either admin or user.',
      },
    },
  },
},
{
  hooks: {
    async beforeCreate(user) {
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10); 
        user.password = hashedPassword;
      }
    }
  }
});

/* this will delete the user password while returning the user object */
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

/* this will validate the password */
User.prototype.authenticate = function(password) {
  return bcrypt.compareSync(password, this.password);
};

export default User;
