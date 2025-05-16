import React from 'react';
import { message } from 'antd';
import { createNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteForm from '@/components/NoteForm';

const CreateNote = () => {
  const navigate = useNavigate(); // 获取导航函数，用于页面跳转
  const { user } = useStore(); // 从全局状态中获取当前用户信息

  // 表单提交时的处理函数
  const handleSubmit = async (values) => {
    try {
      const noteData = {
        ...values, // 展开表单提交的值
        userId: user.id, // 添加当前用户的 ID 到笔记数据中
      };
      await createNote(noteData); // 调用 API 创建笔记
      message.success('笔记创建成功');
      navigate('/notes');
    } catch (error) {
      console.error('Failed to create note:', error);
      message.error('创建笔记失败');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1>创建笔记</h1>
        <NoteForm
          onSubmit={handleSubmit} // 将表单提交的回调函数传递给 NoteForm 组件
          submitButtonText="创建笔记" // 设置提交按钮的文本
        />
      </div>
    </>
  );
};

export default CreateNote;
