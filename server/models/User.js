const pool = require('../config/db');

class User {
  static async getById(userId) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  }

  static async getByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create(email, password) {
    const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [
      email,
      password,
    ]);
    return result.rows[0];
  }

  static async update(userId, email, password) {
    const result = await pool.query('UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *', [
      email,
      password,
      userId,
    ]);
    return result.rows[0];
  }
}

module.exports = User;
