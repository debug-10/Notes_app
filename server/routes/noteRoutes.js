import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getNotesByCategory,
  importNotes, // 导入导入笔记函数
} from "../controllers/noteController.js";

const router = express.Router();

// 创建笔记
router.post("/", createNote);

// 获取用户的所有笔记
router.get("/user/:userId", getNotes);

// 获取单个笔记
router.get("/:id", getNote);

// 根据分类获取笔记
router.get("/categories/:userId/:categoryId", getNotesByCategory);

// 更新笔记
router.put("/:id", updateNote);

// 删除笔记
router.delete("/:id", deleteNote);

// 导入笔记路由
router.post("/import", importNotes);

export default router;
