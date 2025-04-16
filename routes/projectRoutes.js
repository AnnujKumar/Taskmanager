const express = require('express');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require('../controllers/projectControllers');
// Create a new project
router.post('/', isAuthenticated, createProject);

// Get all projects
router.get('/', isAuthenticated, getAllProjects);

// Get a single project by ID
router.get('/:id', isAuthenticated,);

// Update a project by ID
router.put('/:id', isAuthenticated, updateProject);

// Delete a project by ID
router.delete('/:id', isAuthenticated,deleteProject);

module.exports = router;