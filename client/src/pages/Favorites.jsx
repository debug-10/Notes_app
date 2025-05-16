import { useEffect, useState } from 'react';
import {
  List,
  Card,
  Typography,
  Spin,
  Empty,
  Tag,
  Space,
  Breadcrumb,
} from 'antd';
import {
  HomeOutlined,
  StarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StarFilled,
} from '@ant-design/icons';
import { getFavoriteNotes, deleteNote, toggleNoteFavorite } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const { Title, Paragraph } = Typography;

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavoriteNotes(user.id);
      setNotes(response.data);
    } catch (error) {
      console.error('获取收藏笔记失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const handleToggleFavorite = async (noteId, currentStatus) => {
    try {
      await toggleNoteFavorite(noteId, !currentStatus);
      fetchFavorites(); // 重新获取收藏列表
    } catch (error) {
      console.error('更新收藏状态失败:', error);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('确定要删除这个笔记吗？')) {
      try {
        await deleteNote(noteId);
        fetchFavorites();
      } catch (error) {
        console.error('删除笔记失败:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full bg-gray-50 min-h-screen">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined /> 首页
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <StarOutlined /> 收藏笔记
          </Breadcrumb.Item>
        </Breadcrumb>

        <Title level={2} className="mb-6">
          我的收藏
        </Title>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : notes.length === 0 ? (
          <Empty description="暂无收藏笔记" />
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={notes}
            renderItem={(item) => (
              <List.Item>
                <Card
                  className="h-full transition-all duration-300 hover:shadow-lg border border-gray-200"
                  hoverable
                  actions={[
                    <EyeOutlined
                      key="view"
                      onClick={() => navigate(`/notes/${item.id}`)}
                    />,
                    <EditOutlined
                      key="edit"
                      onClick={() => navigate(`/notes/edit/${item.id}`)}
                    />,
                    <DeleteOutlined
                      key="delete"
                      className="text-red-500"
                      onClick={() => handleDelete(item.id)}
                    />,
                    <StarFilled
                      key="favorite"
                      className="text-yellow-500"
                      onClick={() => handleToggleFavorite(item.id, true)}
                    />,
                  ]}
                  cover={
                    <div className="h-32 bg-gradient-to-r from-yellow-100 to-yellow-200 flex items-center justify-center p-4">
                      <Title
                        level={4}
                        className="text-center text-yellow-800 m-0 line-clamp-2"
                      >
                        {item.title}
                      </Title>
                    </div>
                  }
                >
                  <Card.Meta
                    description={
                      <Paragraph ellipsis={{ rows: 3 }} className="text-gray-600">
                        {item.content}
                      </Paragraph>
                    }
                  />
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Tag color="blue" key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
};

export default Favorites;