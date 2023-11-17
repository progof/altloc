const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Получение профиля пользователя
router.get('/profile', authMiddleware, userController.getUserProfile);

// Обновление профиля пользователя
router.put('/profile', authMiddleware, userController.updateUserProfile);

module.exports = router;
