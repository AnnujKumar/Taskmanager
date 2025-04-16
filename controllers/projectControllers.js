const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

const createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const project = await Project.create({ name });
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getAllProjects  = async (req, res) => {
  try {
    const projects = await Project.find().populate('tasks');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getProjectById =  async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('tasks');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateProject = async (req, res) => {
  try {
    const { name } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteProject =  async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      await Task.deleteMany({ _id: { $in: project.tasks } });
  
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};