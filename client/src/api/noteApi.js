import axiosInstance from './axiosInstance';

// 创建笔记
export const createNote = async (noteData) => {
  return axiosInstance.post('/notes', noteData);
};

// 查询某个用户的所有笔记
export const getNotes = async (userId) => {
  return axiosInstance.get(`/notes/user/${userId}`);
};

// 查询笔记详情
export const getNote = async (noteId) => {
  return axiosInstance.get(`/notes/${noteId}`);
};

// 查询某个用户某个分类的所有笔记
export const getNotesByCategory = async (userId, categoryId) => {
  return axiosInstance.get(`/notes/categories/${userId}/${categoryId}`);
};

// 更新笔记
export const updateNote = async (noteId, noteData) => {
  return axiosInstance.put(`/notes/${noteId}`, noteData);
};

// 删除笔记
export const deleteNote = async (noteId) => {
  return axiosInstance.delete(`/notes/${noteId}`);
};

// 导入笔记
export const importNotes = async (notesData, userId) => {
  const data = {
    notes: notesData,
    user_id: userId,
  };
  return axiosInstance.post('/notes/import', data);
};

// 收藏/取消收藏笔记
export const toggleNoteFavorite = async (noteId, isFavorite) => {
  return axiosInstance.put(`/notes/${noteId}/favorite`, { isFavorite });
};

// 获取收藏的笔记
export const getFavoriteNotes = async (userId) => {
  return axiosInstance.get(`/notes/favorites/${userId}`);
};

// 导出笔记为Markdown
export const exportNoteAsMarkdown = async (noteId) => {
  try {
    // 使用window.open直接打开导出链接，触发浏览器下载
    window.open(`${axiosInstance.defaults.baseURL}/notes/${noteId}/export`, '_blank');
    return { success: true };
  } catch (error) {
    console.error('导出笔记失败:', error);
    throw error;
  }
};
