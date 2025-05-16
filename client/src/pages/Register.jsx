import { Form, Input, Button, Typography, message, Card, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { registerUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const { Title, Text } = Typography;

const Register = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await registerUser(values);
      setUser(response.data); // 设置用户信息
      message.success('注册成功'); // 使用 message 组件显示成功消息
      navigate('/login'); // 跳转到登录页面
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请检查输入信息是否正确'); // 使用 message 组件显示错误消息
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
          <Title level={2} className="text-blue-600 mb-1">欢迎注册</Title>
          <Text type="secondary">创建您的笔记应用账号</Text>
        </div>
        
        <Form 
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="px-2"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="用户名" 
              className="rounded-lg py-2"
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-gray-400" />} 
              placeholder="邮箱" 
              className="rounded-lg py-2"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="密码" 
              className="rounded-lg py-2"
            />
          </Form.Item>
          
          <Form.Item className="mb-2">
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              className="h-12 rounded-lg text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
            >
              立即注册
            </Button>
          </Form.Item>
        </Form>
        
        <Divider plain className="text-gray-400">或者</Divider>
        
        <div className="text-center mt-4">
          <Text type="secondary">已有账号？</Text>
          <Link to="/login" className="text-blue-500 hover:text-blue-700 ml-1 font-medium">
            立即登录
          </Link>
        </div>
      </Card>
      
      <div className="absolute bottom-4 text-center w-full text-gray-500 text-sm">
        © {new Date().getFullYear()} 笔记应用 - 您的个人笔记助手
      </div>
    </div>
  );
};

export default Register;
