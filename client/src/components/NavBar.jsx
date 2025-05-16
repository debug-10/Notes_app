import { Layout, Menu, Button, Avatar, Dropdown, Switch, message } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/store/userStore';
import { useThemeStore } from '@/store/themeStore';
import {
  HomeOutlined,
  FolderOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const { user, logout } = useStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  
  const handleThemeChange = () => {
    toggleTheme();
    message.success(`已切换到${theme === 'light' ? '暗色' : '亮色'}主题`);
  };

  return (
    <Header className="bg-white shadow-md px-4 flex items-center justify-between w-full z-50" style={{ backgroundColor: theme === 'dark' ? '#141414' : '#ffffff' }}>
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 mr-8">
          笔记应用
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="border-none flex-1"
          items={[
            {
              key: '/',
              icon: <HomeOutlined />,
              label: (
                <Link to="/" className="text-base font-medium">
                  首页
                </Link>
              ),
              className: 'hover:text-blue-500 transition-colors duration-300',
            },
            {
              key: '/categories',
              icon: <FolderOutlined />,
              label: (
                <Link to="/categories" className="text-base font-medium">
                  分类
                </Link>
              ),
              className: 'hover:text-blue-500 transition-colors duration-300',
            },
            {
              key: '/notes',
              icon: <FileTextOutlined />,
              label: (
                <Link to="/notes" className="text-base font-medium">
                  笔记
                </Link>
              ),
              className: 'hover:text-blue-500 transition-colors duration-300',
            },
          ]}
        />
      </div>

      <div className="flex items-center">
        {/* 主题切换开关 */}
        <div className="mr-4 flex items-center">
          <Switch
            checkedChildren={<BulbFilled />}
            unCheckedChildren={<BulbOutlined />}
            checked={theme === 'dark'}
            onChange={handleThemeChange}
            className="theme-switch"
          />
        </div>

        {user ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'profile',
                  icon: <UserOutlined />,
                  label: '个人信息',
                  onClick: () => window.location.href = '/profile',
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  onClick: logout,
                },
              ],
            }}
          >
            <div className="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-1 rounded-full transition-colors duration-300">
              <Avatar icon={<UserOutlined />} className="bg-blue-500" />
              <span className="ml-2 text-gray-700">
                {user.nickname || user.username}
              </span>
            </div>
          </Dropdown>
        ) : (
          <div className="space-x-2">
            <Button type="text">
              <Link to="/login">登录</Link>
            </Button>
            <Button type="primary">
              <Link to="/register">注册</Link>
            </Button>
          </div>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
