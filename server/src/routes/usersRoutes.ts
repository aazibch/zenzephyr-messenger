import express from 'express';
import { signup, login, logout, protect } from '../controllers/authController';
import {
  getMe,
  getUser,
  blockUser,
  unblockUser
} from '../controllers/usersController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

router.get('/:usernameOrId', protect, getUser);
router.patch('/:id/block', protect, blockUser);
router.patch('/:id/unblock', protect, unblockUser);

export default router;
