import db from "./db.js";

db.prepare(`CREATE TABLE IF NOT EXISTS tasks( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title STRING,
    description STRING,
    status BOOLEAN,
    deadline DATE)`).run()

export const getTasks = () => db.prepare("SELECT * FROM tasks").all();

export const getTaskById = (id) => db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

export const saveTask = (user_id, title, description, status, deadline) => db.prepare("INSERT INTO tasks (user_id, title, description, status, deadline) VALUES (?, ?, ?, ?, ?)").run(user_id, title, description, status, deadline);

export const updateTask = (id, user_id, title, description, status, deadline) => db.prepare("UPDATE tasks SET user_id = ?, title = ?, description = ?, status = ?, deadline = ? WHERE id = ?").run(user_id, title, description, status, deadline, id)

export const deleteTask = (id) => db.prepare("DELETE FROM tasks WHERE id = ?").run(id)

export const getTasksByUserId = (user_id) => db.prepare("SELECT * FROM tasks WHERE user_id = ?").all(user_id);