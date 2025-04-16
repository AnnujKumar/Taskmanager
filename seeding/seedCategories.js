const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Category = require('../models/categoryModel');
require('dotenv').config();

const seedCategories = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/taskmanager");
    console.log('Connected to the database');
    await Category.deleteMany();
    console.log('Existing categories cleared');

    const categories = [];
    for (let i = 0; i < 10; i++) {
      const name = faker.commerce.department(); // Generates a random category name
      categories.push({ name });
    }

    await Category.insertMany(categories);
    console.log('10 categories seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding categories:', error);
    mongoose.connection.close();
  }
};

seedCategories();