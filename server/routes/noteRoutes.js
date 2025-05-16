import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getNotesByCategory,
  importNotes,
  toggleFavorite,
  getFavoriteNotes,
  exportNoteAsMarkdown,
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

// 收藏/取消收藏笔记
router.put("/:id/favorite", toggleFavorite);

// 获取收藏的笔记
router.get("/favorites/:userId", getFavoriteNotes);

// 导出笔记为Markdown
router.get("/:id/export", exportNoteAsMarkdown);

export default router;
