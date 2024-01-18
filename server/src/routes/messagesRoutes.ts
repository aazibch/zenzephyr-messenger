import express from 'express';
import { createMessage, getMessages } from '../controllers/messagesController';
import {
  editImage,
  saveImageToCloud,
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
  editImage('attachedImage'),
  saveImageToCloud('attachedImage'),
  createMessage
);

export default router;
