const Category = require('../models/categoryModel');
const Task = require('../models/taskModel');
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
const getAllCategories =  async (req, res) => {
  try {
    const categories = await Category.find().populate('tasks');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('tasks');
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateCategory =  async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true, runValidators: true }
      );
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        await Task.deleteMany({ _id: { $in: category.tasks } });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};