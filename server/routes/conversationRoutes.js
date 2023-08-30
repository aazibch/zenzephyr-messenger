const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const conversationController = require('../controllers/conversationController');
const messageRoutes = require('./messageRoutes');

router.use('/:conversationId/messages', messageRoutes);

router.use(authController.protect);

router.route('/').post(conversationController.createConversation);
router
  .route('/:conversationId/approve')
  .patch(conversationController.approveConversation);

router
  .route('/:conversationId')
  .delete(conversationController.deleteConversation);

module.exports = router;
