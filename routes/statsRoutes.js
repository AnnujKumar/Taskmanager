const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const {
  finishedTasks,
  tasksByCategory,
  overdueTasks,
  getProductivityMetrics,
  getProjectMetrics,
} = require("../controllers/statsControllers");
router.get('/tasks-status', isAuthenticated,finishedTasks );

// 2. Tasks by Category
router.get('/tasks-by-category', isAuthenticated, tasksByCategory);

// 3. Notifications for Overdue Tasks
router.get('/overdue-tasks', isAuthenticated, overdueTasks);

// 4. User Productivity Metrics (Tasks Completed Per Day/Week)
router.get('/productivity', isAuthenticated, getProductivityMetrics);
// 5. Project Progress Tracking
router.get('/project-progress', isAuthenticated,getProjectMetrics);

module.exports = router;