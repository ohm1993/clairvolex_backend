import User from '../models/User.js';

const login =  async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.authenticate(password)) {
      return null;
    }
    return user; 
  } catch (error) {
    throw error;
  }
}

const register =  async (name, email, password) => {
  try {
    const newUser = await User.create({ name,email,password });
    return newUser;
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      throw new Error(errorMessage);
    }
    throw error; 
  }
}

  export default {
    login,
    register
  };