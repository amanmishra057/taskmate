TaskMate - Collaborative Task Management System
TaskMate is a lightweight, full-stack task management web application where users can create projects, manage tasks on a Kanban board, and collaborate with team members. This project was built from scratch to demonstrate core web development principles.
Tech Stack
 * Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)
 * Backend: Node.js, Express.js
 * Database: SQLite
 * Authentication: JSON Web Tokens (JWT)
Features
 * User Authentication: Secure user registration and login.
 * Project Management: Create and view projects.
 * Kanban Board:
   * Visualize tasks in "To Do", "In Progress", and "Done" columns.
   * Drag-and-drop tasks to update their status.
 * Task Management: Create, edit, and update tasks with details like title, description, priority, and due date.
 * Collaboration: Add comments to tasks to discuss details and progress.
Local Setup and Installation
Follow these steps to run the project locally.
Prerequisites
 * Node.js (v14 or later)
 * npm (comes with Node.js)
Backend Setup
 * **Navigate to the backend directory:**bash
   cd backend
   

 * Install dependencies:
   npm install

 * Create the environment file:
   Copy the .env.example to a new file named .env and update the JWT_SECRET with a new secret key.
   cp.env.example.env

 * Initialize the database:
   This command will create the taskmate.db file and set up all the necessary tables.
   npm run initdb

 * Start the backend server:
   The server will run on http://localhost:3000.
   npm start

Frontend Usage
The frontend is served directly by the backend server. Once the backend is running, you can access the application by navigating to http://localhost:3000 in your web browser.
API Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Log in an existing user | No |
| GET | /api/projects | List projects for user | Yes |
| POST | /api/projects | Create a new project | Yes |
| GET | /api/projects/:id/tasks | List tasks for a project | Yes |
| POST | /api/tasks | Create a new task | Yes |
| PUT | /api/tasks/:id | Update an existing task | Yes |
| DELETE | /api/tasks/:id | Delete a task | Yes |
| GET | /api/comments/task/:id | List comments for a task | Yes |
| POST | /api/comments/task/:id | Add a comment to a task | Yes |