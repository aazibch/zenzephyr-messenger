import express from 'express';
import {
  createConversation,
  deleteConversation,
  getConversations
} from '../controllers/conversationsController';
import { protect } from '../controllers/authController';

const router = express.Router();

router.get('/', protect, getConversations);
router.post('/', protect, createConversation);
router.delete('/:id', protect, deleteConversation);

export default router;
