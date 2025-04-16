const mongoose = require("mongoose")
const Task = require('../models/taskModel');

const finishedTasks = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    console.log(userId)
    const finishedTasks = await Task.countDocuments({ users: { $in: [userId] }, status: 'Done' });
    const unfinishedTasks = await Task.countDocuments({
      users: { $in: [userId] },
      status: { $in: ['Not Started', 'In Progress'] },
    });
    const tasks = await Task.find({_id:userId})
    console.log(tasks.length)
    res.status(200).json({ finishedTasks, unfinishedTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const tasksByCategory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const tasksByCategory = await Task.aggregate([
      { $match: { users: { $in: [userId] } } }, 
      { $unwind: '$category' }, 
      {
        $lookup: {
          from: 'categories', 
          localField: 'category', 
          foreignField: '_id', 
          as: 'categoryDetails', 
        },
      },
      { $unwind: '$categoryDetails' },
      {
        $group: {
          _id: {
            id: '$categoryDetails._id', 
            name: '$categoryDetails.name', 
          },
          count: { $sum: 1 }, 
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ tasksByCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const overdueTasks = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const overdueTasks = await Task.find({
      users: { $in: [userId] },
      dueDate: { $lt: new Date() },
      status: { $ne: 'Done' },
    });

    res.status(200).json({ overdueTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getProductivityMetrics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const tasksCompleted = await Task.aggregate([
      { $match: { users: { $in: [userId] }, status: 'Done' } },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            week: { $isoWeek: '$updatedAt' }, 
            day: { $dayOfWeek: '$updatedAt' }, 
          },
          count: { $sum: 1 }, 
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1, '_id.day': 1 } }, 
    ]);


    const dailyMetrics = tasksCompleted.map((entry) => ({
      year: entry._id.year,
      week: entry._id.week,
      day: entry._id.day,
      count: entry.count,
    }));

    const weeklyMetrics = tasksCompleted.reduce((acc, entry) => {
      const weekKey = `${entry._id.year}-W${entry._id.week}`;
      if (!acc[weekKey]) {
        acc[weekKey] = 0;
      }
      acc[weekKey] += entry.count;
      return acc;
    }, {});

    res.status(200).json({ dailyMetrics, weeklyMetrics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getProjectMetrics =  async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user.id);
  
      const projectProgress = await Task.aggregate([
        { $match: { users: { $in: [userId] } } },
        {
          $group: {
            _id: '$project',
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Done'] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            totalTasks: 1,
            completedTasks: 1,
            progress: {
              $cond: [
                { $eq: ['$totalTasks', 0] },
                0,
                { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] },
              ],
            },
          },
        },
      ]);
  
      res.status(200).json({ projectProgress });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  
module.exports = {
    finishedTasks,
    tasksByCategory,
    overdueTasks,
    getProductivityMetrics,
    getProjectMetrics,
};