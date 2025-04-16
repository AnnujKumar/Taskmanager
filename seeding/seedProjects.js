const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Project = require('../models/projectModel');
require('dotenv').config();

const seedProjects = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/taskmanager");
    console.log('Connected to the database');
    await Project.deleteMany();
    console.log('Existing projects cleared');

    const projects = [];
    for (let i = 0; i < 10; i++) {
      const name = faker.commerce.productName(); // Generates a random project name
      projects.push({ name });
    }

    await Project.insertMany(projects);
    console.log('10 projects seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding projects:', error);
    mongoose.connection.close();
  }
};

seedProjects();