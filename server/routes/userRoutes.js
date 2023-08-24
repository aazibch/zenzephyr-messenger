const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.get('/me', userController.getMe);
router.patch('/updateMyPassword', authController.updateMyPassword);

module.exports = router;
