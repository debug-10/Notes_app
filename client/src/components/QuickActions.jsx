import { Card, Space, Button } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const QuickActions = () => (
  <Card title="快捷操作" className="mb-6">
    <Space>
      <Button type="primary" icon={<FileTextOutlined />}>
        <Link to="/create-note">新建笔记</Link>
      </Button>
      <Button icon={<TeamOutlined />}>
        <Link to="/categories">管理分类</Link>
      </Button>
      <Button icon={<StarOutlined />}>
        <Link to="/favorites">查看收藏</Link>
      </Button>
    </Space>
  </Card>
);

export default QuickActions;
