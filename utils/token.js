import jwt from 'jsonwebtoken';
const generateToken =  async (user) => {
  try {
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return token;
  } catch (error) {
    throw error;
  }
}

export default {
  generateToken
};
