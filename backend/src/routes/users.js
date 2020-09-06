const express = require('express')
const router = express.Router();
const usersController = require('../controllers/usersController');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-Upload')
const commentController = require('../controllers/commentController')
//Register router
router.post('/register', usersController.signup);

//Login router
router.post('/login', usersController.login);

router.post('/forgot_password', usersController.forgotPassword);

router.post('/verify_token', usersController.verifyToken)

router.post('/reset_password', usersController.resetPassword);

//Get User
router.get('/', checkAuth, usersController.getUser);

//Update User
router.post('/update', checkAuth, fileUpload.single('avatar_img'), usersController.updateUser);

//Post comments
router.post('/comment', checkAuth, commentController.postComment);

module.exports = router;