// backend/initDb.js
const db = require('./db');

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);`;

const createProjectsTable = `
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);`;

const createMembershipsTable = `
CREATE TABLE IF NOT EXISTS memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    project_id INTEGER,
    role TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);`;

const createTasksTable = `
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'todo',
    priority TEXT DEFAULT 'medium',
    assignee_id INTEGER,
    due_date TEXT,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY(assignee_id) REFERENCES users(id) ON DELETE SET NULL
);`;

const createCommentsTable = `
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    user_id INTEGER,
    content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);`;

db.serialize(() => {
  db.run(createUsersTable, (err) => {
    if (err) console.error("Error creating users table:", err.message);
    else console.log("Users table created or already exists.");
  });

  db.run(createProjectsTable, (err) => {
    if (err) console.error("Error creating projects table:", err.message);
    else console.log("Projects table created or already exists.");
  });

  db.run(createMembershipsTable, (err) => {
    if (err) console.error("Error creating memberships table:", err.message);
    else console.log("Memberships table created or already exists.");
  });

  db.run(createTasksTable, (err) => {
    if (err) console.error("Error creating tasks table:", err.message);
    else console.log("Tasks table created or already exists.");
  });

  db.run(createCommentsTable, (err) => {
    if (err) console.error("Error creating comments table:", err.message);
    else console.log("Comments table created or already exists.");
  });

  db.close((err) => {
    if (err) console.error('Error closing the database connection:', err.message);
    else console.log('Database connection closed.');
  });
});
