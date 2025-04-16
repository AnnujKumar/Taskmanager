const express = require('express');
const isAuthenticated = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  createTask,
  getAllUserTasks,
  filterTasks,
  sortTasks,
  getIndividualTask,
  updateTask,
  deleteTask,
  updateCategory,
  updateProject,
  updatePartial,
  updateStatus,
  addAttachments,
  updateRecurringStatus,
  addDependency,
  assignTask,
  shareProject,
} = require("../controllers/taskControllers")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/attachments'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix); 
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/')) {
    cb(null, true); 
  } else {
    cb(new Error('Only image and document files are allowed'), false); 
  }
};

const upload = multer({ storage, fileFilter });
//Create Task
router.post('/', isAuthenticated, createTask);
//Get All Tasks for a user 
router.get('/', isAuthenticated, getAllUserTasks);
//Filter Tasks
router.get('/filter', isAuthenticated, filterTasks);
//Sort tasks
router.get('/sort', isAuthenticated, sortTasks);
//Get a task
router.get('/:id', isAuthenticated, getIndividualTask);
//Update a task
router.put('/:id', isAuthenticated,updateTask);
//Delete a Task
router.delete('/:id', isAuthenticated,deleteTask);
// Update task category
router.patch('/:id/category', isAuthenticated, updateCategory);
// Update task project
router.patch('/:id/project', isAuthenticated, updateProject);
//Modify dueDate priority and estimated time
router.patch('/:id/details', isAuthenticated, updatePartial);
//Change Status or update
router.patch('/:id/status', isAuthenticated, updateStatus);
//Add Attachments
router.patch('/:id/attachments', isAuthenticated, upload.array('attachments', 5), addAttachments);
//Change Recurring Status 
router.patch('/:id/recurring', isAuthenticated, updateRecurringStatus);
//Add Dependency
router.patch('/:id/dependencies', isAuthenticated, addDependency);
//Assign Task to users
router.patch('/:id/assign', isAuthenticated, assignTask);
//Share Project with teammates
router.patch('/:id/share', isAuthenticated, shareProject);

module.exports = router;