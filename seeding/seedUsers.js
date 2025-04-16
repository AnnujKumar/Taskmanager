const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../models/userModel');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/taskmanager");
    console.log('Connected to the database');
    await User.deleteMany();
    console.log('Existing users cleared');

    const users = [];
    for (let i = 0; i < 100; i++) {
      const username = faker.helpers.replaceSymbols('??????_????'); // Generates a username with letters, numbers, and underscores
      const email = faker.internet.email();
      const password = 'password123';
      const avatar = faker.image.avatar();

      users.push({
        username,
        email,
        password,
        avatar,
        activityLogs: [
          {
            action: 'User created',
            timestamp: new Date(),
          },
        ],
      });
    }

    await User.insertMany(users);
    console.log('100 users seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding users:', error);
    mongoose.connection.close();
  }
};

seedUsers();