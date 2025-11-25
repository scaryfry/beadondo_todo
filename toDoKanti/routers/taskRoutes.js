import { Router } from "express";
import * as Task from "../data/task.js";
import authentication from "../util/authentication.js";

const router = Router();

router.get("/", authentication, (req, res) => {
  const tasks = Task.getTasksByUserId(req.userId);
  res.json(tasks);
});

router.get("/search", authentication, (req, res) => {
  const keyword = req.query.q || "";
  const tasks = Task.searchTasks(req.userId, keyword);
  res.json(tasks);
});

router.get("/:id", authentication, (req, res) => {
  const task = Task.getTaskById(+req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

router.post("/", authentication, (req, res) => {
  console.log("USER ID:", req.userId);

  const userId = req.userId;
  const { title, description, status, deadline, category, priority } = req.body;

  if (!title || !description || status === undefined || !deadline || !category || priority === undefined) {
    return res.status(400).json({ message: "Missing required data" });
  }

  try {
    const saved = Task.saveTask(userId, title, description, status, deadline, category, priority);
    const task = Task.getTaskById(saved.lastInsertRowid);
    res.json(task);

  } catch (err) {
    console.log("TASK ERROR:", err);
    res.status(500).json({ message: "Internal error" });
  }
});


router.put("/:id", authentication, (req, res) => {
  const id = +req.params.id;
  let task = Task.getTaskById(id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  const { title, description, status, deadline, category, priority } = req.body;

  if (!title || !description || status === undefined || !deadline || !category || priority === undefined) {
    return res.status(400).json({ message: "Missing required data" });
  }

  Task.updateTask(id, req.userId, title, description, status, deadline, category, priority);
  res.json(Task.getTaskById(id));
});

router.delete("/:id", authentication, (req, res) => {
  const id = +req.params.id;
  const task = Task.getTaskById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  Task.deleteTask(id);
  res.status(204).send();
});

export default router;
