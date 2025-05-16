import React, { useState, useEffect } from 'react';
import { List, Card, Tag, Typography, Spin, Empty, Breadcrumb } from 'antd';
import {
  HomeOutlined,
  FolderOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { getNotesByCategory } from '@/api/noteApi';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const { Title, Paragraph } = Typography;

const CategoryNotes = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 获取分类名称
        const categoriesResponse = await getCategories();
        const category = categoriesResponse.data.find(
          (cat) => cat.id === parseInt(categoryId),
        );
        if (category) {
          setCategoryName(category.name);
        }

        // 获取分类下的笔记
        const fetchedNotes = await getNotesByCategory(user.id, categoryId);
        setNotes(fetchedNotes.data);
      } catch (error) {
        console.error('Failed to fetch notes by category:', error);
        message.error('获取笔记失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, user?.id]);

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
            <Link to="/categories">
              <FolderOutlined /> 分类
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FileTextOutlined /> {categoryName || `分类 ${categoryId}`}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Title level={2} className="mb-6">
          {categoryName || `分类 ${categoryId}`}的笔记
        </Title>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : notes.length === 0 ? (
          <Empty description={`${categoryName || '该分类'}下暂无笔记`} />
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={notes}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  className="h-full transition-all duration-300 hover:shadow-lg border border-gray-200"
                  actions={[
                    <Link key="view" to={`/notes/${item.id}`}>
                      查看详情
                    </Link>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <Title level={4} className="m-0">
                        {item.title}
                      </Title>
                    }
                    description={
                      <Paragraph
                        ellipsis={{ rows: 3 }}
                        className="text-gray-600 mt-2"
                      >
                        {item.content}
                      </Paragraph>
                    }
                  />
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Tag color="blue" key={tag} className="m-0 mb-1">
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

export default CategoryNotes;
