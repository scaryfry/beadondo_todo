import db from "./db.js";

db.prepare(`CREATE TABLE IF NOT EXISTS  categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name STRING,
            user_id INTEGER,
            task_id INTEGER)`).run();

export const getCategories = ()=> db.prepare("SELECT * FROM categories").all();

export const getCategoryById = (id)=> db.prepare("SELECT * FROM categories WHERE id = ?").get(id)

export const saveCategory = (name, user_id, task_id) => db.prepare("INSERT INTO categories (name, user_id, task_id) VALUES (? , ?, ?)").run(name, user_id, task_id);

export const updateCategory = (id, name, user_id, task_id) => db.prepare("UPDATE categories SET name = ?, user_id = ?, task_id = ? WHERE id = ?").run(id, name, user_id, task_id)

export const deleteCategory = (id) => db.prepare("DELETE FROM categories WHERE id = ?").run(id)