import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin, Empty } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const { Title, Text } = Typography;

const Categories = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        message.error('获取分类失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  const categoryColors = [
    'from-blue-400 to-blue-500',
    'from-green-400 to-green-500',
    'from-purple-400 to-purple-500',
    'from-yellow-400 to-yellow-500',
    'from-red-400 to-red-500',
    'from-indigo-400 to-indigo-500',
    'from-pink-400 to-pink-500',
    'from-teal-400 to-teal-500',
  ];

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full bg-gray-50 min-h-screen">
        <Title level={2} className="mb-6">
          分类管理
        </Title>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : categories.length === 0 ? (
          <Empty description="暂无分类" />
        ) : (
          <List
            grid={{
              gutter: 24,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={categories}
            renderItem={(item, index) => (
              <List.Item>
                <Link to={`/notes/categories/${item.id}`}>
                  <Card
                    hoverable
                    className="transition-all duration-300 hover:shadow-lg border-0 overflow-hidden"
                    bodyStyle={{ padding: 0 }}
                  >
                    <div
                      className={`bg-gradient-to-r ${categoryColors[index % categoryColors.length]} h-32 flex items-center justify-center`}
                    >
                      <FolderOutlined className="text-white text-4xl" />
                    </div>
                    <div className="p-4 bg-white">
                      <Title level={4} className="m-0 text-center">
                        {item.name}
                      </Title>
                      <Text className="block text-center text-gray-500 mt-2">
                        点击查看分类笔记
                      </Text>
                    </div>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
};

export default Categories;
