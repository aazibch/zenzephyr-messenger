import express from 'express';
import { createConversation } from '../controllers/conversationsController';
import { protect } from '../controllers/authController';

const router = express.Router();

router.post('/', protect, createConversation);

export default router;
