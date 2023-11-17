const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Проверка, существует ли пользователь с таким email
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создание нового пользователя
    const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password]);

    // Создание JWT токена
    const token = jwt.sign({ user_id: newUser.rows[0].id }, jwtConfig.secret, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Проверка, существует ли пользователь с таким email и password
    const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    // Создание JWT токена
    const token = jwt.sign({ user_id: user.rows[0].id }, jwtConfig.secret, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = { register, login };


