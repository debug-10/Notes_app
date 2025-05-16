import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 创建主题状态管理
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light', // 默认为亮色主题
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage', // 持久化存储的键名
    }
  )
);