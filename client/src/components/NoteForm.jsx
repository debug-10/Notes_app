import { useState, useEffect } from 'react';
import React from 'react';
import {
  Form,
  Input,
  Button,
  Tag,
  Select,
  message,
  Space,
  Tooltip,
} from 'antd';
import { PlusOutlined, TagOutlined } from '@ant-design/icons';
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
  const [loading, setLoading] = useState(false); // 加载状态
  const [submitting, setSubmitting] = useState(false); // 提交状态

  // 使用 useEffect 钩子在组件加载时获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories(); // 调用 API 获取分类数据
        setCategories(response.data); // 将获取到的分类数据存储到状态中
      } catch (error) {
        console.error('获取分类失败:', error);
        message.error('获取分类失败');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 表单提交时的处理函数
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await onSubmit({ ...values, tags }); // 调用父组件传入的 onSubmit 回调函数，传入表单值和标签
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 添加标签的处理函数
  const handleAddTag = () => {
    if (!inputTag) return;

    // 去除首尾空格
    const trimmedTag = inputTag.trim();
    if (!trimmedTag) {
      return;
    }

    // 检查标签是否已存在
    if (tags.includes(trimmedTag)) {
      message.warning('标签已存在');
      return;
    }

    // 添加新标签
    setTags([...tags, trimmedTag]);
    setInputTag(''); // 清空输入框
  };

  // 输入框内容变化时的处理函数
  const handleInputTagChange = (e) => {
    setInputTag(e.target.value); // 更新输入框中的标签内容
  };

  // 按下回车键时添加标签
  const handleInputTagPressEnter = (e) => {
    e.preventDefault();
    handleAddTag();
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
      className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-sm" // 样式优化
      initialValues={initialValues} // 设置表单初始值
    >
      {/* 标题输入框 */}
      <Form.Item
        label="标题" // 标签文本
        name="title" // 表单字段名称
        rules={[{ required: true, message: '请输入笔记标题' }]} // 验证规则
      >
        <Input placeholder="请输入笔记标题" maxLength={100} showCount />
      </Form.Item>

      {/* 内容输入框 */}
      <Form.Item
        label="内容" // 标签文本
        name="content" // 表单字段名称
        rules={[{ required: true, message: '请输入笔记内容' }]} // 验证规则
      >
        <Input.TextArea
          placeholder="请输入笔记内容"
          autoSize={{ minRows: 6, maxRows: 12 }}
          showCount
          maxLength={5000}
        />
      </Form.Item>

      {/* 分类选择框 */}
      <Form.Item
        label="类型" // 标签文本
        name="categoryId" // 表单字段名称
        rules={[{ required: true, message: '请选择笔记类型' }]} // 验证规则
      >
        <Select
          placeholder="请选择笔记类型"
          loading={loading}
          showSearch
          optionFilterProp="children"
        >
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 标签输入和显示区域 */}
      <Form.Item label="标签">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={inputTag} // 绑定输入框值
              onChange={handleInputTagChange} // 输入框内容变化时调用 handleInputTagChange 函数
              placeholder="输入标签后按回车或点击添加" // 输入框占位符
              onPressEnter={handleInputTagPressEnter} // 按下回车键时添加标签
              prefix={<TagOutlined />}
              maxLength={20}
            />
            <Button
              type="primary"
              onClick={handleAddTag}
              icon={<PlusOutlined />}
            >
              添加
            </Button>
          </Space.Compact>

          <div className="flex gap-2 flex-wrap mt-2">
            {tags.length === 0 ? (
              <span className="text-gray-400">暂无标签</span>
            ) : (
              tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  color="blue"
                  className="mb-1"
                >
                  {tag}
                </Tag>
              ))
            )}
          </div>

          {tags.length > 0 && (
            <div className="text-gray-400 text-xs">共 {tags.length} 个标签</div>
          )}
        </Space>
      </Form.Item>

      {/* 提交按钮 */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          block
          size="large"
          className="mt-4"
        >
          {submitButtonText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NoteForm;
