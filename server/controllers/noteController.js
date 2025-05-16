import pool from "../config/db.js";

// 创建笔记
export const createNote = async (req, res) => {
  try {
    const { userId, title, content, categoryId, tags } = req.body;
    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content, category_id, tags) VALUES (?, ?, ?, ?, ?)",
      [userId, title, content, categoryId, JSON.stringify(tags)]
    );
    res.status(201).json({
      id: result.insertId,
      userId,
      title,
      content,
      categoryId,
      tags,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取笔记列表
export const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query("SELECT * FROM notes WHERE user_id = ?", [
      userId,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根据分类获取笔记
export const getNotesByCategory = async (req, res) => {
  try {
    const { userId, categoryId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND category_id = ?",
      [userId, categoryId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取单个笔记
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新笔记
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId, tags } = req.body;
    await pool.query(
      "UPDATE notes SET title = ?, content = ?, category_id = ?, tags = ? WHERE id = ?",
      [title, content, categoryId, JSON.stringify(tags), id]
    );
    res.status(200).json({ id, title, content, categoryId, tags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 删除笔记
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notes WHERE id = ?", [id]);
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// noteController.js 中的 importNotes 函数
export const importNotes = async (req, res) => {
  try {
    const { notes, userId } = req.body;

    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: "导入的数据必须是笔记数组" });
    }

    const promises = notes.map(async (note) => {
      const { title, content, categoryId, tags } = note;
      const [result] = await pool.query(
        "INSERT INTO notes (user_id, title, content, category_id, tags) VALUES (?,?,?,?,?)",
        [userId, title, content, categoryId, JSON.stringify(tags)]
      );
      return {
        id: result.insertId,
        userId,
        title,
        content,
        categoryId,
        tags,
      };
    });

    const importedNotes = await Promise.all(promises);

    res.status(200).json({
      message: `成功导入 ${importedNotes.length} 条笔记`,
      notes: importedNotes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 收藏/取消收藏笔记
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFavorite } = req.body;

    await pool.query("UPDATE notes SET is_favorite = ? WHERE id = ?", [
      isFavorite,
      id,
    ]);

    res.status(200).json({
      id,
      isFavorite,
      message: isFavorite ? "笔记已收藏" : "笔记已取消收藏",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取收藏的笔记
export const getFavoriteNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND is_favorite = true",
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 导出笔记为Markdown
export const exportNoteAsMarkdown = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 获取笔记数据
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "笔记不存在" });
    }
    
    const note = rows[0];
    
    // 构建Markdown内容
    let markdownContent = `# ${note.title}\n\n`;
    
    // 添加标签（如果有）
    if (note.tags && note.tags.length > 0) {
      markdownContent += '标签: ';
      markdownContent += note.tags.map(tag => `\`${tag}\``).join(', ');
      markdownContent += '\n\n';
    }
    
    // 添加内容
    markdownContent += note.content;
    
    // 设置响应头，指定文件类型和下载文件名
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.md"`);
    
    // 发送Markdown内容
    res.send(markdownContent);
  } catch (error) {
    console.error("导出笔记失败:", error);
    res.status(500).json({ error: error.message });
  }
};
