// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './taskmate.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Enable foreign key enforcement
    db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
      if (pragmaErr) {
        console.error('Failed to enable foreign keys:', pragmaErr.message);
      } else {
        console.log('Foreign key enforcement is enabled.');
      }
    });
  }
});

module.exports = db;
