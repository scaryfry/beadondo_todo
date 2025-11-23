import db from "./db.js";

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title STRING,
    description STRING,
    status BOOLEAN,
    deadline DATE,
    category STRING
  )
`).run();

// Existing functions
export const getTasks = () => db.prepare("SELECT * FROM tasks").all();

export const getTaskById = (id) => 
  db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

export const saveTask = (user_id, title, description, status, deadline, category) => {
  const statusInt = status ? 1 : 0; 
  return db
    .prepare("INSERT INTO tasks (user_id, title, description, status, deadline, category) VALUES (?, ?, ?, ?, ?, ?)")
    .run(user_id, title, description, statusInt, deadline, category);
};

export const updateTask = (id, user_id, title, description, status, deadline, category) => {
  const statusInt = status ? 1 : 0;
  return db
    .prepare("UPDATE tasks SET user_id = ?, title = ?, description = ?, status = ?, deadline = ?, category = ? WHERE id = ?")
    .run(user_id, title, description, statusInt, deadline, category, id);
};

export const deleteTask = (id) =>
  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

export const getTasksByUserId = (user_id) =>
  db.prepare("SELECT * FROM tasks WHERE user_id = ?").all(user_id);

export const searchTasks = (user_id, keyword) => {
  const q = `%${keyword}%`;
  return db
    .prepare(`
      SELECT * FROM tasks
      WHERE user_id = ?
      AND (title LIKE ? OR description LIKE ? OR category LIKE ?)
    `)
    .all(user_id, q, q, q);
};