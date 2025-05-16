import { Form, Input, Button, Typography, message, Card, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
const { Title, Text } = Typography;

const Login = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await loginUser(values);
      setUser(response.data);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Card 
        className="w-full max-w-md shadow-xl rounded-xl border-0 overflow-hidden"
        style={{ 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="text-center mb-6">
          <Title level={2} className="text-blue-600 mb-1">欢迎回来</Title>
          <Text type="secondary">登录您的笔记应用账号</Text>
        </div>
        
        <Form 
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="px-2"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="用户名" 
              className="rounded-lg py-2"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="密码" 
              className="rounded-lg py-2"
            />
          </Form.Item>
          
          <Form.Item name="remember" valuePropName="checked" className="mb-2">
            <div className="flex justify-between items-center">
              <Checkbox>记住我</Checkbox>
              <Link to="/forgot-password" className="text-blue-500 hover:text-blue-700">
                忘记密码?
              </Link>
            </div>
          </Form.Item>
          
          <Form.Item className="mb-2">
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              className="h-12 rounded-lg text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        <Divider plain className="text-gray-400">或者</Divider>
        
        <div className="text-center mt-4">
          <Text type="secondary">还没有账号？</Text>
          <Link to="/register" className="text-blue-500 hover:text-blue-700 ml-1 font-medium">
            立即注册
          </Link>
        </div>
      </Card>
      
      <div className="absolute bottom-4 text-center w-full text-gray-500 text-sm">
        © {new Date().getFullYear()} 笔记应用 - 您的个人笔记助手
      </div>
    </div>
  );
};

export default Login;
