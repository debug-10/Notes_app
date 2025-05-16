import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, message, Spin, Typography, Breadcrumb, Divider, Space } from 'antd';
import { StarOutlined, StarFilled, EditOutlined, ArrowLeftOutlined, ClockCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { getNote, toggleNoteFavorite } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const { Title, Paragraph, Text } = Typography;

const Note = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        setLoading(true);
        const fetchedNote = await getNote(id);
        setNote(fetchedNote.data);
      } catch (error) {
        console.error('获取笔记详情失败:', error);
        message.error('获取笔记详情失败');
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNoteDetails();
  }, [id, navigate]);

  const handleToggleFavorite = async () => {
    try {
      await toggleNoteFavorite(id, !note.is_favorite);
      setNote({ ...note, is_favorite: !note.is_favorite });
      message.success(note.is_favorite ? '已取消收藏' : '已添加到收藏');
    } catch (error) {
      console.error('更新收藏状态失败:', error);
      message.error('操作失败，请重试');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto flex justify-center items-center" style={{ minHeight: '70vh' }}>
          <Spin size="large" tip="加载笔记中..." />
        </div>
      </>
    );
  }

  if (!note) {
    return (
      <>
        <Navbar />
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="text-center">
            <Title level={3}>笔记不存在或已被删除</Title>
            <Button type="primary" onClick={() => navigate('/notes')}>
              返回笔记列表
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/notes">笔记</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{note.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Card 
          className="note-card shadow-md hover:shadow-lg transition-shadow duration-300" 
          bordered={false}
          title={
            <div className="flex justify-between items-center">
              <Title level={3} style={{ margin: 0 }}>{note.title}</Title>
              <Space>
                <Button 
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/notes/edit/${note.id}`)}
                >
                  编辑
                </Button>
                <Button 
                  type={note.is_favorite ? "default" : "primary"} 
                  icon={note.is_favorite ? <StarFilled className="text-yellow-500" /> : <StarOutlined />}
                  onClick={handleToggleFavorite}
                  ghost={!note.is_favorite}
                >
                  {note.is_favorite ? '取消收藏' : '收藏'}
                </Button>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => navigate('/notes')}
                >
                  返回
                </Button>
              </Space>
            </div>
          }
        >
          <div className="mb-4 flex items-center">
            <ClockCircleOutlined className="mr-2 text-gray-500" />
            <Text type="secondary">
              创建时间: {new Date(note.created_at).toLocaleString()}
              {note.updated_at && note.updated_at !== note.created_at && 
                ` | 更新时间: ${new Date(note.updated_at).toLocaleString()}`}
            </Text>
          </div>

          <Divider />
          
          <div className="note-content bg-gray-50 p-4 rounded-md mb-6">
            <Paragraph className="whitespace-pre-wrap text-lg">
              {note.content}
            </Paragraph>
          </div>
          
          {note.tags && note.tags.length > 0 && (
            <div className="my-4">
              <div className="flex items-center mb-2">
                <TagsOutlined className="mr-2 text-blue-500" />
                <Text strong>标签:</Text>
              </div>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <Tag color="blue" key={tag} className="px-3 py-1 text-sm">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default Note;
