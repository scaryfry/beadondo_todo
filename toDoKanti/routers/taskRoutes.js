import { Router } from "express";
import * as Task from "../data/task.js";
import authentication from "../util/authentication.js";


const router = Router();

router.get("/", authentication, (req, res) => {
    const userId = req.userId;
    const tasks = Task.getTasksByUserId(userId);
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
  const userId = req.userId;
  const { title, description, status, deadline } = req.body;
  console.log("REQUEST BODY:", req.body);

  if (!title || !description || status === undefined || !deadline) {
    return res.status(400).json({ message: "Missing required data" });
  }
  const saved = Task.saveTask(userId, title, description, status, deadline);
  const task = Task.getTaskById(saved.lastInsertRowid);
  res.json(task);
});

router.put("/:id", authentication, (req, res) => {
  const id = +req.params.id;
  let task = Task.getTaskById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const userId = req.userId;
  const { title, description, status, deadline } = req.body;

  if (!title || !description || status === undefined || !deadline) {
    return res.status(400).json({ message: "Missing required data" });
  }

  Task.updateTask(id, userId, title, description, status, deadline);
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

router.get("/:user_id", authentication, (req, res) => {
  const user_id = +req.params.user_id;
  const tasks = Task.getTasksByUserId(user_id);
  res.json(tasks);
});

export default router;
