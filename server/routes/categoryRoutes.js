import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// 创建分类
router.post("/", createCategory);

// 获取分类列表
router.get("/", getCategories);

// 获取单个分类
router.get("/:id", getCategory);

// 更新分类
router.put("/:id", updateCategory);

// 删除分类
router.delete("/:id", deleteCategory);

export default router;
