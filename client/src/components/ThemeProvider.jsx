import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { ConfigProvider, theme as antdTheme } from 'antd';

// 定义主题配置
const themes = {
  light: {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      colorBgContainer: '#ffffff',
      colorBgLayout: '#f5f5f5',
    },
  },
  dark: {
    algorithm: antdTheme.darkAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      colorBgContainer: '#141414',
      colorBgLayout: '#000000',
    },
  },
};

const ThemeProvider = ({ children }) => {
  const { theme } = useThemeStore();
  
  // 当主题变化时，更新文档根元素的类名
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = theme === 'dark' ? '#000000' : '#f5f5f5';
  }, [theme]);

  return (
    <ConfigProvider theme={themes[theme]}>
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;