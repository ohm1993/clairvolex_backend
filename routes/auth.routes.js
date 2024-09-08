import express from 'express';
import tokenService  from '../utils/token.js';
import authService from '../services/AuthService.js';
const router = express.Router();
//admin@gmail.com//admin@123

/* login routes */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    if (!user) {
      return res.status(404).json({ status: false, error: 'User or Password not found' });
    }
    const token = await tokenService.generateToken(user);
    res.status(200).json({ status: true, user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Register route with validation */
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    name = name ? name.trim() : '';
    email = email ? email.trim() : '';
    password = password ? password.trim() : '';
    role = role ? role.trim() : 'user';
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name or Email or Password fields cannot be empty!" });
    }
    const newUser = await authService.register(req.body.name,req.body.email,req.body.password);
    res.status(201).json({ status: true, user: newUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router ;