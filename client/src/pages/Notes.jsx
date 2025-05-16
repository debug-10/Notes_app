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
} from 'antd';
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { getNotes, deleteNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const fetchNotesData = await getNotes(user.id);
      setNotes(fetchNotesData.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      alert('获取笔记失败');
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
          const validNotes = notesData.filter(note => {
            return note && typeof note === 'object' && note.title && note.content;
          });

          if (validNotes.length === 0) {
            message.error('导入的笔记数据无效，请确保每个笔记至少包含标题和内容');
            return;
          }

          if (validNotes.length < notesData.length) {
            message.warning(`只有${validNotes.length}/${notesData.length}条笔记数据有效`);
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
              message.error(`服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`);
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

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full bg-gray-50 min-h-screen">
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
          className="p-4"
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
                    onClick={() => {
                      setModalVisible(true);
                      setSelectedNoteId(item.id);
                    }}
                  />,
                ]}
                cover={
                  <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center p-4">
                    <Title
                      level={4}
                      className="text-center text-blue-800 m-0 line-clamp-2"
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
                <div className="mt-4 flex flex-wrap gap-1">
                  {item.tags &&
                    item.tags.map((tag) => (
                      <Tag color="blue" key={tag} className="m-0 mb-1">
                        {tag}
                      </Tag>
                    ))}
                </div>
              </Card>
            </List.Item>
          )}
        />

        {/* 删除确认对话框 */}
        <Modal
          title="确认删除"
          open={modalVisible}
          onOk={async () => {
            try {
              await deleteNote(selectedNoteId);
              message.success('笔记删除成功');
              fetchNotes();
            } catch (error) {
              console.error('Failed to delete note:', error);
              message.error('删除笔记失败');
            } finally {
              setModalVisible(false);
              setSelectedNoteId(null);
            }
          }}
          onCancel={() => {
            setModalVisible(false);
            setSelectedNoteId(null);
          }}
          okButtonProps={{ danger: true, className: 'bg-red-500' }}
        >
          <p>确定要删除这条笔记吗？此操作不可恢复。</p>
        </Modal>

        {/* 导入笔记对话框 */}
        <Modal
          title="导入笔记"
          open={importModalVisible}
          onCancel={() => setImportModalVisible(false)}
          footer={null}
        >
          <p className="mb-4">
            请选择JSON格式的笔记文件进行导入。文件格式应为笔记数组。
          </p>
          <Upload
            accept=".json"
            beforeUpload={handleImportNotes}
            showUploadList={false}
          >
            <Button
              icon={<UploadOutlined />}
              className="bg-blue-50 text-blue-500 border-blue-200 hover:bg-blue-100"
            >
              选择文件
            </Button>
          </Upload>
        </Modal>
      </div>
    </>
  );
};

export default Notes;
