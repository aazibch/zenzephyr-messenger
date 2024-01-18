import express from 'express';
import {
  createConversation,
  deleteConversation,
  getConversations
} from '../controllers/conversationsController';
import { protect } from '../controllers/authController';
import messagesRouter from './messagesRoutes';
import {
  editImage,
  saveImageToCloud,
  uploadAttachedImage
} from '../middleware/imageUpload';

const router = express.Router();

router.use('/:conversationId/messages', messagesRouter);

router.get('/', protect, getConversations);
router.post(
  '/',
  protect,
  uploadAttachedImage,
  editImage('attachedImage'),
  saveImageToCloud('attachedImage'),
  createConversation
);
router.delete('/:id', protect, deleteConversation);

export default router;
