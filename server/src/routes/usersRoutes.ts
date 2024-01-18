import express from 'express';
import { signup, login, logout, protect } from '../controllers/authController';
import {
  getMe,
  getUser,
  blockUser,
  unblockUser,
  updateMe
} from '../controllers/usersController';
import {
  editImage,
  saveImageToCloud,
  uploadProfileImage
} from '../middleware/imageUpload';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.patch(
  '/me',
  protect,
  uploadProfileImage,
  editImage('profileImage'),
  saveImageToCloud('profileImage'),
  updateMe
);

router.get('/:usernameOrId', protect, getUser);
router.patch('/:id/block', protect, blockUser);
router.patch('/:id/unblock', protect, unblockUser);

export default router;
