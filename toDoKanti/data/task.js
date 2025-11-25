import db from "./db.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    status INTEGER,
    deadline TEXT,
    category TEXT,
    priority INTEGER
  )
`).run();


export const getTasks = () => db.prepare("SELECT * FROM tasks").all();

export const getTaskById = (id) => 
  db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

export const saveTask = (user_id, title, description, status, deadline, category, priority, ) => {
  const statusInt = status ? 1 : 0; 
  return db
    .prepare("INSERT INTO tasks (user_id, title, description, status, deadline, category, priority) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(user_id, title, description, statusInt, deadline, category, priority);
};

export const updateTask = (id, user_id, title, description, status, deadline, category, priority) => {
  const statusInt = status ? 1 : 0;
  return db
    .prepare("UPDATE tasks SET user_id = ?, title = ?, description = ?, status = ?, deadline = ?, category = ?, priority = ? WHERE id = ?")
    .run(user_id, title, description, statusInt, deadline, category, priority, id);
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