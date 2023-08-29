const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const conversationsController = require('../controllers/conversationController');

router.use(authController.protect);

router.route('/').post(conversationsController.createConversation);

module.exports = router;
