const Comment = require('../models/commentsModel');
const Task = require('../models/taskModel');
const notifyTaskUsers = async (taskId, message) => {
    const task = await Task.findById(taskId).populate('users');
    if (!task) {
      throw new Error('Task not found');
    }
  
    for (const user of task.users) {
      user.notifications.push({ message });
      await user.save();
    }
  };

const createComment = async (req, res) => {
    try {
      const { text, taskId } = req.body;
      const userId = req.user.id;
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      const comment = await Comment.create({
        text,
        author: userId,
        task: taskId,
      });
      task.comments.push(comment._id);
      await task.save();
      res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  const createCommentForTask = async (req, res) => {
    try {
      const { text } = req.body;
      const userId = req.user.id;
      const task = await Task.findOne({ _id: req.params.id, users: { $in: [userId] } });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      const comment = await Comment.create({
        text,
        author: userId,
        task: task._id,
      });
      task.comments.push(comment._id);
      await task.save();
      await notifyTaskUsers(task._id, `A new comment has been added to the task "${task.title}".`);
      res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  const getAllComments = async (req, res) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId).populate({
        path: 'comments',
        populate: { path: 'author', select: 'name email' },
      });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json({ comments: task.comments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const updateComment =  async (req, res) => {
    try {
      const { text } = req.body;
      const userId = req.user.id;
      const comment = await Comment.findOne({ _id: req.params.id, author: userId });
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found or you do not have access' });
      }
      comment.text = text;
      await comment.save();
      res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
const deleteComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const comment = await Comment.findOne({ _id: req.params.id, author: userId });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found or you do not have access' });
        }
        await Task.findByIdAndUpdate(comment.task, { $pull: { comments: comment._id } })
        await comment.remove();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
createComment,
createCommentForTask,
getAllComments,
updateComment,
deleteComment,
};