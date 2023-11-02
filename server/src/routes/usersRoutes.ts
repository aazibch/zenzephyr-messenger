import express from 'express';
import { signup, login, logout, protect } from '../controllers/authController';
import { getUser } from '../controllers/usersController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/:id', protect, getUser);

export default router;
