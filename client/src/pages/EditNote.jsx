import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { updateNote, getNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteForm from '@/components/NoteForm';

const EditNote = () => {
  const navigate = useNavigate(); // 获取导航函数，用于页面跳转
  const { noteId } = useParams(); // 从路由参数中获取笔记 ID
  const { user } = useStore(); // 从全局状态中获取当前用户信息
  const [form] = Form.useForm(); // 使用 Ant Design 的 Form useForm 钩子管理表单
  const [initialValues, setInitialValues] = useState({}); // 表单初始值状态，初始为空对象
  const [tags, setTags] = useState([]);

  // 使用 useEffect 钩子在组件加载时获取笔记数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const noteResponse = await getNote(noteId); // 调用 API 获取当前编辑的笔记
        const noteData = noteResponse.data; // 获取笔记数据
        const values = {
          title: noteData.title, // 笔记标题
          content: noteData.content, // 笔记内容
          categoryId: noteData.categoryId, // 笔记分类
          tags: noteData.tags, // 笔记标签
        };
        setTags(noteData.tags || []);
        form.setFieldsValue(values);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('获取数据失败');
      }
    };
    fetchData();
  }, [noteId]);

  // 表单提交时的处理函数
  const handleSubmit = async (values) => {
    try {
      const noteData = {
        ...values, // 展开表单提交的值
        userId: user.id, // 添加当前用户的 ID 到笔记数据中
      };
      await updateNote(noteId, noteData); // 调用 API 更新笔记
      message.success('笔记更新成功');
      navigate('/notes');
    } catch (error) {
      console.error('Failed to update note:', error);
      message.error('更新笔记失败');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1>编辑笔记</h1>
        <NoteForm
          form={form} // 绑定表单实例
          initialValues={initialValues} // 传递表单初始值
          onSubmit={handleSubmit} // 传递表单提交的回调函数
          submitButtonText="更新笔记" // 设置提交按钮的文本
        />
      </div>
    </>
  );
};

export default EditNote;
