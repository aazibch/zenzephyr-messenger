import express from 'express';
import { signup, login, logout, protect } from '../controllers/authController';
import { blockUser, getMe, getUser } from '../controllers/usersController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

router.get('/:id', protect, getUser);
router.patch('/:id/block', protect, blockUser);

export default router;
