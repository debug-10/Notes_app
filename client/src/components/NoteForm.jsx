import { useState, useEffect } from 'react';
import React from 'react';
import { Form, Input, Button, Tag, Select, message } from 'antd';
import { getCategories } from '@/api/categoryApi';

// 笔记表单组件
const NoteForm = ({
  initialValues = {}, // 表单初始值，默认为空对象
  onSubmit, // 表单提交时的回调函数
  submitButtonText, // 提交按钮的文本
  form, // Ant Design Form 实例，用于表单管理
}) => {
  const [tags, setTags] = useState(initialValues.tags || []); // 标签状态，初始值为传入的 initialValues.tags 或空数组
  const [inputTag, setInputTag] = useState(''); // 输入框中的标签内容，初始为空字符串
  const [categories, setCategories] = useState([]); // 分类状态，初始为空数组

  // 使用 useEffect 钩子在组件加载时获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(); // 调用 API 获取分类数据
        setCategories(response.data); // 将获取到的分类数据存储到状态中
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        message.error('获取分类失败');
      }
    };
    fetchCategories();
  }, []);

  // 表单提交时的处理函数
  const handleSubmit = async (values) => {
    onSubmit({ ...values, tags }); // 调用父组件传入的 onSubmit 回调函数，传入表单值和标签
  };

  // 输入框内容变化时的处理函数
  const handleInputTagChange = (e) => {
    setInputTag(e.target.value); // 更新输入框中的标签内容
    if (inputTag && !tags.includes(inputTag)) {
      // 如果输入框中有内容且标签未重复
      setTags([...tags, inputTag]); // 将新标签添加到标签列表中
      setInputTag(''); // 清空输入框
    }
  };

  // 删除标签的处理函数
  const handleRemoveTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag); // 过滤掉要删除的标签
    setTags(newTags); // 更新标签列表
  };

  // 渲染组件
  return (
    <Form
      form={form} // 绑定 Ant Design Form 实例
      onFinish={handleSubmit} // 表单提交时调用 handleSubmit 函数
      layout="vertical" // 表单布局为垂直
      className="max-w-2xl mx-auto" // 样式:最大宽度为 2xl，居中
      initialValues={initialValues} // 设置表单初始值
    >
      {/* 标题输入框 */}
      <Form.Item
        label="标题" // 标签文本
        name="title" // 表单字段名称
        rules={[{ required: true, message: '请输入笔记标题' }]} // 验证规则
      >
        <Input placeholder="请输入笔记标题" />
      </Form.Item>
      {/* 内容输入框 */}
      <Form.Item
        label="内容" // 标签文本
        name="content" // 表单字段名称
        rules={[{ required: true, message: '请输入笔记内容' }]} // 验证规则
      >
        <Input.TextArea
          placeholder="请输入笔记内容"
          autoSize={{ minRows: 4, maxRows: 8 }}
        />
      </Form.Item>
      {/* 分类选择框 */}
      <Form.Item
        label="类型" // 标签文本
        name="categoryId" // 表单字段名称
        rules={[{ required: true, message: '请选择笔记类型' }]} // 验证规则
      >
        <Select placeholder="请选择笔记类型">
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {/* 标签输入和显示区域 */}
      <div className="mb-4">
        <label className="block mb-2">标签</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={inputTag} // 绑定输入框值
            onChange={handleInputTagChange} // 输入框内容变化时调用 handleInputTagChange 函数
            placeholder="输入标签" // 输入框占位符
            onPressEnter={handleInputTagChange} // 按下回车键时调用 handleInputTagChange 函数
          />
          {/* 点击按钮时调用 handleInputTagChange 函数 */}
          <Button onClick={handleInputTagChange}>添加标签</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* 遍历标签列表 */}
          {tags.map((tag) => (
            <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>
      {/* 提交按钮 */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {/* 提交按钮的文本，由父组件传入 */}
          {submitButtonText}
        </Button>
      </Form.Item>
    </Form>
  );
};
export default NoteForm;
