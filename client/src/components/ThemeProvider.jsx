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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor =
      theme === 'dark' ? '#000000' : '#f5f5f5';

    // 添加过渡动画样式
    document.body.style.transition = 'background-color 0.3s ease';

    // 设置 CSS 变量
    document.documentElement.style.setProperty(
      '--primary-color',
      theme === 'dark' ? '#177ddc' : '#1677ff',
    );
    document.documentElement.style.setProperty(
      '--bg-color',
      theme === 'dark' ? '#141414' : '#ffffff',
    );
    document.documentElement.style.setProperty(
      '--text-color',
      theme === 'dark' ? '#ffffff' : '#000000',
    );
    document.documentElement.style.setProperty(
      '--border-color',
      theme === 'dark' ? '#303030' : '#f0f0f0',
    );

    // 添加全局样式
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      }
      
      .theme-switch {
        background: ${theme === 'dark' ? '#177ddc' : '#1677ff'};
      }
      
      .theme-switch .ant-switch-handle::before {
        background: ${theme === 'dark' ? '#141414' : '#fff'};
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  return <ConfigProvider theme={themes[theme]}>{children}</ConfigProvider>;
};

export default ThemeProvider;
