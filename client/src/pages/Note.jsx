import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, message } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { getNote, toggleNoteFavorite } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Note = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const fetchedNote = await getNote(id);
        console.log(fetchedNote);
        setNote(fetchedNote.data);
      } catch (error) {
        console.error('Failed to fetch note details:', error);
        alert('获取笔记详情失败');
        navigate('/notes');
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

  if (!note) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <Card 
          className="note-card" 
          hoverable
          title={
            <div className="flex justify-between items-center">
              <span>{note.title}</span>
              <Button 
                type="text" 
                icon={note.is_favorite ? <StarFilled className="text-yellow-500" /> : <StarOutlined />}
                onClick={handleToggleFavorite}
              >
                {note.is_favorite ? '取消收藏' : '收藏'}
              </Button>
            </div>
          }
        >
          <Card.Meta description={note.content} />
          <div className="my-4">
            {note.tags.map((tag) => (
              <Tag color="cyan" key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Note;
