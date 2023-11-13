import express from 'express';
import { createMessage, getMessages } from '../controllers/messagesController';
import {
  editAttachedImage,
  saveAttachedImageToCloud,
  uploadAttachedImage
} from '../middleware/imageUpload';
import { protect } from '../controllers/authController';

const router = express.Router({
  mergeParams: true
});

router.get('/', protect, getMessages);
router.post(
  '/',
  protect,
  uploadAttachedImage,
  editAttachedImage,
  saveAttachedImageToCloud,
  createMessage
);

export default router;
