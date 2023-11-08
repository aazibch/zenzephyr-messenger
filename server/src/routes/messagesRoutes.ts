import express from 'express';
import { getMessages } from '../controllers/messagesController';
import { protect } from '../controllers/authController';

const router = express.Router({
  mergeParams: true
});

router.get('/', protect, getMessages);

export default router;
