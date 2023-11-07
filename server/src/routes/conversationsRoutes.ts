import express from 'express';
import {
  createConversation,
  getConversations
} from '../controllers/conversationsController';
import { protect } from '../controllers/authController';

const router = express.Router();

router.get('/', protect, getConversations);
router.post('/', protect, createConversation);

export default router;
