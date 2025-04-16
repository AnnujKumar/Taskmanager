# Task Manager API

Task Manager is a RESTful API designed to help users manage tasks, projects, categories, and more. It provides endpoints for user authentication, task management, project tracking, and statistical insights.

---

## Setup and Run

### Prerequisites

1. [Node.js](https://nodejs.org/) installed on your machine.
2. [MongoDB](https://www.mongodb.com/) installed and running locally or on a cloud service.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/AnnujKumar/Taskmanager.git
   cd TaskManager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:

   ```
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. The API will be available at `http://localhost:5000`.

---

## Approach to Solving the Problem

The Task Manager API was designed with scalability, modularity, and user-centric functionality in mind. Below is an overview of the approach:

### 1. **Modular Architecture**

- Each feature (e.g., tasks, projects, categories, users) is encapsulated in its own route and controller file.
- This modular structure ensures better maintainability and scalability as new features can be added without affecting existing ones.

### 2. **Authentication and Authorization**

- User authentication is implemented using JSON Web Tokens (JWT).
- Middleware (`authMiddleware`) is used to protect routes and ensure only authenticated users can access certain endpoints.

### 3. **Middleware for Reusability**

- Middleware is used for common tasks such as authentication and file uploads (e.g., `multer` for handling avatar and attachment uploads).
- This reduces code duplication and ensures consistent behavior across routes.

### 4. **RESTful API Design**

- The API adheres to REST principles, with clear and predictable endpoints for CRUD operations.
- HTTP methods (GET, POST, PUT, PATCH, DELETE) are used appropriately to represent actions on resources.

### 5. **File Uploads**

- File uploads (e.g., avatars, task attachments) are handled using `multer` with custom storage and filtering logic.
- Uploaded files are stored in organized directories (`uploads/avatars` and `uploads/attachments`).

### 6. **Task and Project Management**

- Tasks and projects are designed to support advanced features such as filtering, sorting, dependencies, recurring tasks, and attachments.
- This ensures flexibility for users to manage their workflows effectively.

### 7. **Statistics and Insights**

- Endpoints for statistics (e.g., task status, overdue tasks, productivity metrics) provide users with actionable insights.
- This helps users track progress and improve productivity.

### 8. **Error Handling**

- Centralized error handling ensures consistent and user-friendly error messages.
- Validation is performed at both the request and database levels to ensure data integrity.

### 9. **Database Design**

- MongoDB is used as the database, with Mongoose for schema modeling.
- Relationships between entities (e.g., tasks, projects, users) are managed effectively to ensure data consistency.

### 10. **Scalability**

- The modular design and use of middleware make the API scalable for future enhancements.
- Features such as task sharing and project collaboration are implemented to support multi-user environments.

This approach ensures that the Task Manager API is robust, user-friendly, and adaptable to evolving requirements.

---

# Task Manager API Endpoints

This document provides a detailed overview of all the API endpoints available in the Task Manager application.

---

## Category Endpoints

### Base URL: `/categories`

- **POST `/`**  
  Create a new category.  
  **Authentication**: Required.

- **GET `/`**  
  Retrieve all categories.  
  **Authentication**: Required.

- **GET `/:id`**  
  Retrieve a specific category by ID.  
  **Authentication**: Required.

- **PUT `/:id`**  
  Update a category by ID.  
  **Authentication**: Required.

- **DELETE `/:id`**  
  Delete a category by ID.  
  **Authentication**: Required.

---

## Comment Endpoints

### Base URL: `/comments`

- **POST `/`**  
  Create a new comment.  
  **Authentication**: Required.

- **POST `/:id/comments`**  
  Create a new comment for a specific task.  
  **Authentication**: Required.

- **GET `/task/:taskId`**  
  Retrieve all comments for a specific task.  
  **Authentication**: Required.

- **PUT `/:id`**  
  Update a comment by ID.  
  **Authentication**: Required.

- **DELETE `/:id`**  
  Delete a comment by ID.  
  **Authentication**: Required.

---

## Project Endpoints

### Base URL: `/projects`

- **POST `/`**  
  Create a new project.  
  **Authentication**: Required.

- **GET `/`**  
  Retrieve all projects.  
  **Authentication**: Required.

- **GET `/:id`**  
  Retrieve a specific project by ID.  
  **Authentication**: Required.

- **PUT `/:id`**  
  Update a project by ID.  
  **Authentication**: Required.

- **DELETE `/:id`**  
  Delete a project by ID.  
  **Authentication**: Required.

---

## Statistics Endpoints

### Base URL: `/stats`

- **GET `/tasks-status`**  
  Retrieve the status of all tasks (e.g., completed, pending).  
  **Authentication**: Required.

- **GET `/tasks-by-category`**  
  Retrieve tasks grouped by category.  
  **Authentication**: Required.

- **GET `/overdue-tasks`**  
  Retrieve a list of overdue tasks.  
  **Authentication**: Required.

- **GET `/productivity`**  
  Retrieve user productivity metrics (e.g., tasks completed per day/week).  
  **Authentication**: Required.

- **GET `/project-progress`**  
  Retrieve project progress metrics.  
  **Authentication**: Required.

---

## Task Endpoints

### Base URL: `/tasks`

- **POST `/`**  
  Create a new task.  
  **Authentication**: Required.

- **GET `/`**  
  Retrieve all tasks for the authenticated user.  
  **Authentication**: Required.

- **GET `/filter`**  
  Filter tasks based on specific criteria.  
  **Authentication**: Required.

- **GET `/sort`**  
  Sort tasks based on specific criteria.  
  **Authentication**: Required.

- **GET `/:id`**  
  Retrieve a specific task by ID.  
  **Authentication**: Required.

- **PUT `/:id`**  
  Update a task by ID.  
  **Authentication**: Required.

- **DELETE `/:id`**  
  Delete a task by ID.  
  **Authentication**: Required.

- **PATCH `/:id/category`**  
  Update the category of a task.  
  **Authentication**: Required.

- **PATCH `/:id/project`**  
  Update the project of a task.  
  **Authentication**: Required.

- **PATCH `/:id/details`**  
  Modify the due date, priority, or estimated time of a task.  
  **Authentication**: Required.

- **PATCH `/:id/status`**  
  Change the status of a task.  
  **Authentication**: Required.

- **PATCH `/:id/attachments`**  
  Add attachments to a task (up to 5 files).  
  **Authentication**: Required.

- **PATCH `/:id/recurring`**  
  Update the recurring status of a task.  
  **Authentication**: Required.

- **PATCH `/:id/dependencies`**  
  Add dependencies to a task.  
  **Authentication**: Required.

- **PATCH `/:id/assign`**  
  Assign a task to users.  
  **Authentication**: Required.

- **PATCH `/:id/share`**  
  Share a task's project with teammates.  
  **Authentication**: Required.

---

## User Endpoints

### Base URL: `/users`

- **POST `/signup`**  
  Register a new user with an optional avatar upload.  
  **Authentication**: Not required.

- **POST `/login`**  
  Log in an existing user.  
  **Authentication**: Not required.

- **GET `/profile`**  
  Retrieve the profile of the authenticated user.  
  **Authentication**: Required.

- **POST `/password-reset`**  
  Reset the user's password.  
  **Authentication**: Not required.

- **GET `/activity-logs`**  
  Retrieve the activity logs of the authenticated user.  
  **Authentication**: Required.

- **POST `/logout`**  
  Log out the authenticated user.  
  **Authentication**: Required.

- **GET `/notifications`**  
  Retrieve notifications for the authenticated user.  
  **Authentication**: Required.

- **PATCH `/notifications/:id/read`**  
  Mark a specific notification as read.  
  **Authentication**: Required.

---

## Libraries and Tools Used

The following libraries and tools were used to build the Task Manager API:

1. **Express.js**: For building the server and handling routes.
2. **Mongoose**: For MongoDB object modeling and schema validation.
3. **jsonwebtoken**: For implementing user authentication using JWT.
4. **Multer**: For handling file uploads (e.g., avatars, attachments).
5. **dotenv**: For managing environment variables securely.
6. **Nodemon**: For development, enabling automatic server restarts on file changes.
7. **MongoDB**: As the database for storing tasks, projects, users, and related data.

---

## Database Setup Instructions

1. Install MongoDB locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database named `taskmanager` (or any name of your choice).
3. Update the `MONGO_URI` in the `.env` file with your database connection string.

### Example MongoDB URI

```
MONGO_URI=mongodb://localhost:27017/taskmanager
```

4. The API will automatically create collections for tasks, projects, users, etc., when you start the server.

---

Happy coding!
