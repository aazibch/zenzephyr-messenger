const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.get('/find/:username', userController.findUserToConnect);

router
  .route('/me')
  .get(userController.getMe)
  .patch(
    userController.uploadProfilePhoto,
    userController.resizeProfilePhoto,
    userController.saveProfilePhotoToCloud,
    userController.updateMe
  );
router.patch('/updateMyPassword', authController.updateMyPassword);

module.exports = router;
