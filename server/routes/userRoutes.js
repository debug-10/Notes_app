import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/userController.js";

const router = express.Router();

// 用户注册路由
router.post("/register", registerUser);

// 用户登录路由
router.post("/login", loginUser);

// 获取用户信息路由
router.get("/:id", getUser);

export default router;
