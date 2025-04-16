const express = require('express');
const multer = require('multer');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const {signup,login,getProfile,resetPassword,logActivities,logout,notifications,readNotification} = require("../controllers/userControllers")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });


router.post('/signup', upload.single('avatar'),signup);
router.post('/login',login);
router.get('/profile', isAuthenticated, getProfile);
router.post('/password-reset', resetPassword);
router.get('/activity-logs', isAuthenticated,logActivities);
router.post('/logout', isAuthenticated,logout);
router.get('/notifications', isAuthenticated, notifications);
router.patch('/notifications/:id/read', isAuthenticated, readNotification);
module.exports = router;