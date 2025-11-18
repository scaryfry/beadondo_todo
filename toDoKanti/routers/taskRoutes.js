import { Router } from "express";
import * as Task from "../data/task.js";
import authentication from "../util/authentication.js";


const router = Router();

router.get("/", authentication, (req, res) => {
  const tasks = Task.getTasks();
  res.json(tasks);
});

router.get("/:id", authentication, (req, res) => {
  const task = Task.getTaskById(+req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

router.post("/", authentication, (req, res) => {
  const { user_id, title, description, status, deadline } = req.body;
    if (!user_id || !title || !description || status === undefined || !deadline) {
    return res.status(400).json({ message: "Missing required data" });
    }
  const saved = Task.saveTask(user_id, title, description, status, deadline);
  const task = Task.getTaskById(saved.lastInsertRowid);
  res.json(task);
});
router.put("/:id", authentication, (req, res) => {
  const id = +req.params.id;
  let task = Task.getTaskById(id);
    if (!task) {
    return res.status(404).json({ message: "Task not found" });
    }
  const { user_id, title, description, status, deadline } = req.body;
    if (!user_id || !title || !description || status === undefined || !deadline) {
    return res.status(400).json({ message: "Missing required data" });
    }
  Task.updateTask(id, user_id, title, description, status, deadline);
  res.json(Task.getTaskById(id));
});
router.delete("/:id", authentication, (req, res) => {
  const id = +req.params.id;
  let task = Task.getTaskById(id);
    if (!task) {
    return res.status(404).json({ message: "Task not found" });
    }
  Task.deleteTask(id);
  res.status(204).send();
});

export default router;
