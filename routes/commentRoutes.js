const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const  {
  createComment,
  createCommentForTask,
  getAllComments,
  updateComment,
  deleteComment,
  } = require("../controllers/commentControllers");


// Create a new comment
router.post('/', isAuthenticated, createComment);

// Create a new comment for a specific task
router.post('/:id/comments', isAuthenticated, createCommentForTask);

// Get all comments for a specific task
router.get('/task/:taskId', isAuthenticated, getAllComments);

// Update a comment
router.put('/:id', isAuthenticated,updateComment);

// Delete a comment
router.delete('/:id', isAuthenticated, deleteComment);

module.exports = router;