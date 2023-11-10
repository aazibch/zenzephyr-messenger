import express from 'express';
import { createMessage, getMessages } from '../controllers/messagesController';
import { protect } from '../controllers/authController';

const router = express.Router({
  mergeParams: true
});

router.get('/', protect, getMessages);
router.post('/', protect, createMessage);

export default router;
