const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
require('dotenv').config();

const seedTasks = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/taskmanager");
    console.log('Connected to the database');

    const users = await User.find();
    const categories = await Category.find();

    if (users.length === 0 || categories.length === 0) {
      console.log('No users or categories found. Please seed users and categories first.');
      mongoose.connection.close();
      return;
    }

    await Task.deleteMany();
    console.log('Existing tasks cleared');

    for (let i = 0; i < 100; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      // Create a task
      const task = await Task.create({
        title: faker.lorem.words(5),
        description: faker.lorem.sentence(),
        category: [randomCategory._id], // Add the category ID to the task
        user: randomUser._id,
        dueDate: faker.date.future(),
        priority: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
        estimatedTime: faker.number.int({ min: 1, max: 10 }),
        status: faker.helpers.arrayElement(['Not Started', 'In Progress', 'Done']),
        attachments: [faker.system.filePath()],
        recurring: faker.helpers.arrayElement(['None', 'Daily', 'Weekly', 'Monthly']),
      });

      // Add the task to the category's tasks array
      await Category.findByIdAndUpdate(randomCategory._id, { $push: { tasks: task._id } });
    }

    console.log('100 tasks seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding tasks:', error);
    mongoose.connection.close();
  }
};

seedTasks();