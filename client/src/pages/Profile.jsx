import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Tabs,
  List,
  Tag,
  Spin,
  Empty,
  Button,
  Divider,
} from 'antd';
import {
  UserOutlined,
  StarOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/userStore';
import { getFavoriteNotes } from '@/api/noteApi';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await getFavoriteNotes(user.id);
        setFavoriteNotes(response.data);
      } catch (error) {
        console.error('获取收藏笔记失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full bg-gray-50 min-h-screen">
        <Title level={2} className="mb-6">
          个人中心
        </Title>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 个人信息卡片 */}
          <div className="w-full md:w-1/3">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col items-center text-center">
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  src={user.avatar_url}
                  className="mb-4 bg-blue-500"
                />
                <Title level={3}>{user.nickname || user.username}</Title>
                <Text type="secondary" className="mb-4">
                  {user.email}
                </Text>

                <Divider />

                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <Text strong>用户名:</Text>
                    <Text>{user.username}</Text>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Text strong>注册时间:</Text>
                    <Text>
                      {new Date(user.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 收藏笔记和其他内容 */}
          <div className="w-full md:w-2/3">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <Tabs defaultActiveKey="favorites">
                <TabPane
                  tab={
                    <span>
                      <StarOutlined />
                      我的收藏
                    </span>
                  }
                  key="favorites"
                >
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Spin size="large" />
                    </div>
                  ) : favoriteNotes.length === 0 ? (
                    <Empty description="暂无收藏笔记" />
                  ) : (
                    <List
                      itemLayout="vertical"
                      dataSource={favoriteNotes}
                      renderItem={(note) => (
                        <List.Item
                          key={note.id}
                          actions={[
                            <Button
                              type="link"
                              icon={<EyeOutlined />}
                              onClick={() => navigate(`/notes/${note.id}`)}
                            >
                              查看
                            </Button>,
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => navigate(`/notes/edit/${note.id}`)}
                            >
                              编辑
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <Link to={`/notes/${note.id}`}>{note.title}</Link>
                            }
                            description={
                              <div>
                                <Text type="secondary">
                                  创建时间:{' '}
                                  {new Date(note.created_at).toLocaleString()}
                                </Text>
                                {note.tags && note.tags.length > 0 && (
                                  <div className="mt-2">
                                    {note.tags.map((tag) => (
                                      <Tag color="blue" key={tag}>
                                        {tag}
                                      </Tag>
                                    ))}
                                  </div>
                                )}
                              </div>
                            }
                          />
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            className="text-gray-600"
                          >
                            {note.content}
                          </Paragraph>
                        </List.Item>
                      )}
                    />
                  )}
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
