import { Form, Input, Button, Typography, message } from 'antd';
import { registerUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await registerUser(values);
      setUser(response.data); // 设置用户信息
      message.success('注册成功'); // 使用 message 组件显示成功消息
      navigate('/login'); // 跳转到登录页面
    } catch (error) {
      console.error('Registration failed:', error);
      //   message.error('注册失败，请检查输入信息是否正确'); // 使用 message 组件显示错误消息
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-200">
      <div className="bg-white p-8 rounded-md shadow-lg w-150 mx-auto mt-20">
        <Title level={2}>注册</Title>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入邮箱!' }]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-4">
          已有账号？
          <a href="/login">去登录</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
