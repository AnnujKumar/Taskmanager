const express = require('express');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryControllers');

router.post('/', isAuthenticated, createCategory);

router.get('/', isAuthenticated,getAllCategories);

router.get('/:id', isAuthenticated, getCategoryById);

router.put('/:id', isAuthenticated,updateCategory);

router.delete('/:id', isAuthenticated, deleteCategory);

module.exports = router;