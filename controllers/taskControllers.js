const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Project = require('../models/projectModel');
const mongoose = require('mongoose');

const createTask = async (req, res) => {
  try {
    const { title, description, category, project, dueDate, priority, estimatedTime, status, attachments, recurring } = req.body;
    const userId = req.user.id
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const task = await Task.create({
      title,
      description,
      category,
      project,
      dueDate,
      priority,
      estimatedTime,
      status,
      attachments,
      recurring,
      users: [userId],
    });
    user.tasks.push(task._id);
    await user.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getAllUserTasks = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.user.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const userId = new mongoose.Types.ObjectId(req.user.id);
    console.log(userId)
  
    const user = await User.findById(userId).populate('tasks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const tasks = await user.tasks;
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found for this user' });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const filterTasks = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.user.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { status, priority, dueDate, category, project } = req.query;
    const filter = { users: { $in: [userId] } };
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (dueDate) {
      filter.dueDate = { $lte: new Date(dueDate) };
    }
    if (category) {
      const categ = await Category.findOne({ name: category });
      if (!categ) {
        return res.status(404).json({ error: 'Category not found' });
      }
      filter.category = { $in: [categ._id] };
    }
    if (project) {
      const proj = await Project.findOne({ name: project });
      if (!proj) {
        return res.status(404).json({ error: 'Project not found' });
      }
      filter.project = { $in: [proj._id] };
    }
    const tasks = await Task.find(filter).populate('category').populate('project');
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found matching the criteria' });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const sortTasks = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.user.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { sortBy = 'createdAt', order = 'asc' } = req.query;
    const validSortFields = ['title', 'priority', 'dueDate', 'status', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: `Invalid sort field. Valid fields are: ${validSortFields.join(', ')}` });
    }
    const sortOrder = order === 'desc' ? -1 : 1;
    const tasks = await Task.find({ user: user._id })
      .populate('category')
      .populate('project')
      .sort({ [sortBy]: sortOrder });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found' });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getIndividualTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.user.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const userId = new mongoose.Types.ObjectId(req.user.id);
    // Find the task where the userId exists in the users array
    const task = await Task.findOne({ _id: req.params.id, users: { $in: [userId] } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.user.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, users: { $in: [userId] } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found or you do not have access' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteTask = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const task = await Task.findOneAndDelete({ _id: req.params.id, users: { $in: [userId] } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or you do not have access' });
    }
    await User.updateMany(
      { _id: { $in: task.users } }, 
      { $pull: { tasks: task._id } } 
    );
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateCategory =  async (req, res) => {
  try {
    const { category } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const task = await Task.findOne({ _id: req.params.id});
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const categ = await Category.findOne({name: category});
    if (!task.category.includes(categ)) {
      task.category.push(categ);
      await task.save();
    }
    await Category.findByIdAndUpdate(categ._id, { $addToSet: { tasks: task._id } });

    res.status(200).json({ message: 'Task category updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateProject =  async (req, res) => {
  try {
    const { project } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const task = await Task.findOne({ _id: req.params.id, user: user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const proj = await Project.findOne({ name: project });
    if (!proj) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (!task.project.includes(proj._id)) {
      task.project.push(proj._id);
      await task.save();
    }
    await Project.findByIdAndUpdate(proj._id, { $addToSet: { tasks: task._id } });
    res.status(200).json({ message: 'Task project updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updatePartial = async (req, res) => {
  try {
    const { dueDate, priority, estimatedTime } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: user._id },
      { dueDate, priority, estimatedTime },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task details updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateStatus =  async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: user._id },
      { status },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task status updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const addAttachments =  async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const task = await Task.findOne({ _id: req.params.id, user: user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const uploadedFiles = req.files.map((file) => `/uploads/attachments/${file.filename}`);
    task.attachments.push(...uploadedFiles);
    await task.save();

    res.status(200).json({ message: 'Attachments added successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateRecurringStatus =  async (req, res) => {
  try {
    const { recurring } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: user._id },
      { recurring },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task recurrence updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const addDependency = async (req, res) => {
  try {
    const { dependencies } = req.body; 
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const task = await Task.findOne({ _id: req.params.id});
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const dependentTasks = await Task.find({ _id: { $in: dependencies }, user: user._id });
    if (dependentTasks.length !== dependencies.length) {
      return res.status(400).json({ error: 'One or more dependencies are invalid or do not belong to the user' });
    }
    if (dependencies.includes(task._id.toString())) {
      return res.status(400).json({ error: 'A task cannot depend on itself' });
    }
    task.dependencies = dependencies;
    await task.save();

    res.status(200).json({ message: 'Task dependencies updated successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const assignTask = async (req, res) => {
  try {
    const { usersToAdd } = req.body; // Array of user IDs to add
    const userId = new mongoose.Types.ObjectId(req.user.id)


    const task = await Task.findOne({ _id: req.params.id, users: { $in: [userId] } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or you do not have access' });
    }

    task.users = [...new Set([...task.users, ...usersToAdd])]; 
    await task.save();

    res.status(200).json({ message: 'Users added to the task successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const shareProject = async (req, res) => {
  try {
    const { sharedWith } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const project = await Project.findOne({ _id: req.params.id, user: user._id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    project.sharedWith = [...new Set([...project.sharedWith, ...sharedWith])]; // Avoid duplicates
    await project.save();
    res.status(200).json({ message: 'Project shared successfully', project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
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
};