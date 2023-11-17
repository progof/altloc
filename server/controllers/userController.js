const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const getUserProfile = async (req, res) => {
  try {
    // Извлечение пользователя из базы данных по его ID, взятого из токена
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user_id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Возвращение профиля пользователя
    res.status(200).json({ user: user.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

const updateUserProfile = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Обновление данных пользователя в базе данных
    const updatedUser = await pool.query('UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *', [
      email,
      password,
      req.user_id,
    ]);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Возвращение обновленного профиля пользователя
    res.status(200).json({ user: updatedUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = { getUserProfile, updateUserProfile };
