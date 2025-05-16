import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();

// 允许特定源，并设置 Access-Control-Allow-Credentials
const allowedOrigins = ["http://115.29.178.169:8080", "http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      // 允许没有来源的请求（例如：Postman）
      if (!origin) return callback(null, true);

      // 检查来源是否在允许的列表中
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "这个网站的跨域资源共享(CORS)策略不允许从指定的来源进行访问。";
        return callback(new Error(msg), false);
      }

      // 允许来源
      return callback(null, true);
    },
    credentials: true, // 允许发送 Cookies
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

export default app;
