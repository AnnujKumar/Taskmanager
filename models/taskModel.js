const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      maxlength: [100, 'Task title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Task description cannot exceed 500 characters'],
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
      },
    ],
    project: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    estimatedTime: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Done'],
      default: 'Not Started',
    },
    attachments: [
      {
        type: String,
      },
    ],
    recurring: {
      type: String,
      enum: ['None', 'Daily', 'Weekly', 'Monthly'],
      default: 'None',
    },
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    users:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ]
    , comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
 
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;