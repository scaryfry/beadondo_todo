import { Router } from "express";
import * as Category from "../data/category.js";

const router = Router();

router.get("/", (req, res) => {
  const categories = Category.getCategories();
  res.json(categories);
});

router.get("/:id", (req, res) => {
  const category = Category.getCategoryById(+req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(category);
});
router.post("/", (req, res) => {
  const { name, user_id, task_id } = req.body;
  if (!name || !user_id || !task_id) {
    return res.status(400).json({ message: "Missing required data" });
  }
  const saved = Category.saveCategory(name, user_id, task_id);
  const category = Category.getCategoryById(saved.lastInsertRowid);
  res.json(category);
});
router.put("/:id", (req, res) => {
    const id = +req.params.id;
    let category = Category.getCategoryById(id);
    if (!category) {
    return res.status(404).json({ message: "Category not found" });
    }
    const { name, user_id, task_id } = req.body;
    if (!name || !user_id || !task_id) {
    return res.status(400).json({ message: "Missing required data" });
    }
    Category.updateCategory(id, name, user_id, task_id);
    res.json(Category.getCategoryById(id));
}); 
router.delete("/:id", (req, res) => {
    const id = +req.params.id;
    let category = Category.getCategoryById(id);
    if (!category) {
    return res.status(404).json({ message: "Category not found" });
    }
    Category.deleteCategory(id);
    res.status(204).send();
});
export default router;