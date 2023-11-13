import express from 'express';
import {
  createConversation,
  deleteConversation,
  getConversations
} from '../controllers/conversationsController';
import { protect } from '../controllers/authController';
import messagesRouter from './messagesRoutes';
import {
  editAttachedImage,
  saveAttachedImageToCloud,
  uploadAttachedImage
} from '../middleware/imageUpload';

const router = express.Router();

router.use('/:conversationId/messages', messagesRouter);

router.get('/', protect, getConversations);
router.post(
  '/',
  protect,
  uploadAttachedImage,
  editAttachedImage,
  saveAttachedImageToCloud,
  createConversation
);
router.delete('/:id', protect, deleteConversation);

export default router;
