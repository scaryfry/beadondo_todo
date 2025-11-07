import db from "./db.js";

db.prepare(`CREATE TABLE IF NOT EXISTS tasks( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title STRING,
    description STRING,
    status BOOLEAN,
    deadline DATE)`).run()

export const getTasks = () => db.prepare("SELECT * FROM tasks").all();

export const getTaskById = () => db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

export const saveTask = (user_id, title, description, status, date) => db.prepare("INSERT INTO tasks (user_id, title, description, status, date) VALUES (?, ?, ?, ?)").run(user_id, title, description, status, date);

export const updateTask = (id, user_id, title, description, status, date) => db.prepare("UPDATE users SET user_id = ?, title = ?, description = ?, status = ?, date = ? WHERE id = ?").run(id, user_id, title, description, status, date)

export const deleteTask = (id) => db.prepare("DELETE users WHERE id = ?").run(id)