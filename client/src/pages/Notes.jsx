import { useEffect, useState } from 'react';
import {
  List,
  Card,
  Button,
  Tag,
  Space,
  Modal,
  Upload,
  message,
  Typography,
  Divider,
  Breadcrumb,
  Spin,
  Empty,
  Dropdown,
} from 'antd';
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  StarOutlined,
  StarFilled,
  HomeOutlined,
  FileTextOutlined,
  DownloadOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { getNotes, deleteNote, toggleNoteFavorite, exportNoteAsMarkdown } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { importNotes } from '@/api/noteApi'; // 假设已正确导入

const { Title, Paragraph } = Typography;

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchNotesData = await getNotes(user.id);
      setNotes(fetchNotesData.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      message.error('获取笔记失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleImportNotes = async (file) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target.result;
          const notesData = JSON.parse(content);

          // 验证导入的数据格式
          if (!Array.isArray(notesData)) {
            message.error('导入的JSON必须是笔记数组格式');
            return;
          }

          // 确保每个笔记对象都有必要的字段
          const validNotes = notesData.filter((note) => {
            return (
              note && typeof note === 'object' && note.title && note.content
            );
          });

          if (validNotes.length === 0) {
            message.error(
              '导入的笔记数据无效，请确保每个笔记至少包含标题和内容',
            );
            return;
          }

          if (validNotes.length < notesData.length) {
            message.warning(
              `只有${validNotes.length}/${notesData.length}条笔记数据有效`,
            );
          }

          // 调用API导入笔记
          try {
            const response = await importNotes(validNotes, user.id);
            if (response.status === 200) {
              message.success('笔记导入成功');
              // 重新加载笔记列表
              fetchNotes();
              setImportModalVisible(false);
            } else {
              // 根据不同状态码显示更具体的错误信息
              message.error(`导入失败，状态码: ${response.status}`);
            }
          } catch (error) {
            console.error('导入笔记API调用失败:', error);
            if (error.response) {
              // 服务器响应了请求，但返回了错误状态码
              message.error(
                `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`,
              );
            } else if (error.request) {
              // 请求已发送但没有收到响应
              message.error('服务器无响应，请检查网络连接');
            } else {
              // 请求设置时出现问题
              message.error(`请求错误: ${error.message}`);
            }
          }
        } catch (error) {
          console.error('解析JSON失败:', error);
          message.error('JSON格式错误，请检查导入文件');
        }
      };
      reader.readAsText(file);
      return false; // 阻止自动上传
    } catch (error) {
      console.error('导入笔记失败:', error);
      message.error('导入笔记失败');
    }
  };

  const handleToggleFavorite = async (noteId, currentStatus) => {
    try {
      await toggleNoteFavorite(noteId, !currentStatus);
      // 更新本地状态，避免重新获取所有笔记
      setNotes(
        notes.map((note) =>
          note.id === noteId ? { ...note, is_favorite: !currentStatus } : note,
        ),
      );
      message.success(currentStatus ? '已取消收藏' : '已添加到收藏');
    } catch (error) {
      console.error('更新收藏状态失败:', error);
      message.error('操作失败，请重试');
    }
  };

  const handleDeleteNote = async () => {
    try {
      await deleteNote(selectedNoteId);
      setNotes(notes.filter((note) => note.id !== selectedNoteId));
      setModalVisible(false);
      message.success('笔记已删除');
    } catch (error) {
      console.error('Failed to delete note:', error);
      message.error('删除笔记失败');
    }
  };

  const handleExportNote = async (noteId) => {
    try {
      await exportNoteAsMarkdown(noteId);
      message.success('笔记导出成功');
    } catch (error) {
      console.error('导出笔记失败:', error);
      message.error('导出笔记失败，请重试');
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
            <FileTextOutlined /> 笔记
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="m-0">
            我的笔记
          </Title>
          <Space>
            <Button
              type="primary"
              onClick={() => navigate('/create-note')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              创建笔记
            </Button>
            <Button
              type="default"
              icon={<UploadOutlined />}
              onClick={() => setImportModalVisible(true)}
              className="border-blue-400 text-blue-500 hover:text-blue-600 hover:border-blue-600"
            >
              导入笔记
            </Button>
          </Space>
        </div>

        <Divider className="my-4" />

        {/* 笔记列表 */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : notes.length === 0 ? (
          <Empty description="暂无笔记" />
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
                    <EyeOutlined
                      key="view"
                      onClick={() => navigate(`/notes/${item.id}`)}
                    />,
                    <EditOutlined
                      key="edit"
                      onClick={() => navigate(`/notes/edit/${item.id}`)}
                    />,
                    <Dropdown
                      key="more"
                      menu={{
                        items: [
                          {
                            key: 'export',
                            icon: <DownloadOutlined />,
                            label: '导出笔记',
                            onClick: () => handleExportNote(item.id),
                          },
                          {
                            key: 'delete',
                            icon: <DeleteOutlined className="text-red-500" />,
                            label: '删除笔记',
                            onClick: () => {
                              setModalVisible(true);
                              setSelectedNoteId(item.id);
                            },
                          },
                        ],
                      }}
                    >
                      <MoreOutlined />
                    </Dropdown>,
                    item.is_favorite ? (
                      <StarFilled
                        key="favorite"
                        className="text-yellow-500"
                        onClick={() => handleToggleFavorite(item.id, true)}
                      />
                    ) : (
                      <StarOutlined
                        key="favorite"
                        onClick={() => handleToggleFavorite(item.id, false)}
                      />
                    ),
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

        {/* 删除确认对话框 */}
        <Modal
          title="确认删除"
          open={modalVisible}
          onOk={handleDeleteNote}
          onCancel={() => setModalVisible(false)}
          okText="确认"
          cancelText="取消"
        >
          <p>确定要删除这个笔记吗？此操作不可恢复。</p>
        </Modal>

        {/* 导入笔记对话框 */}
        <Modal
          title="导入笔记"
          open={importModalVisible}
          onCancel={() => setImportModalVisible(false)}
          footer={null}
        >
          <Upload.Dragger
            name="file"
            accept=".json"
            beforeUpload={handleImportNotes}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传，仅支持 .json 格式文件
            </p>
          </Upload.Dragger>
        </Modal>
      </div>
    </>
  );
};

export default Notes;
