const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Регистрация
router.post('/register', authController.register);

// Аутентификация
router.post('/login', authController.login);

module.exports = router;
