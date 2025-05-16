import { useState, useEffect, Suspense } from 'react';
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Spin,
  Space,
  Button,
  Divider,
} from 'antd';
import {
  StarOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { getNotes } from '@/api/noteApi';
import { getCategories } from '@/api/categoryApi';
import { Link } from 'react-router-dom';
import StatsCard from '@/components/StatsCard';
import CategoryStats from '@/components/CategoryStats';
import RecentNotes from '@/components/RecentNotes';
import QuickActions from '@/components/QuickActions';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const { user } = useStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]); // 新增状态存储分类数据

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const allNotesResponse = await getNotes(user.id);
        const allNotes = allNotesResponse.data;

        const totalNotes = allNotes.length;
        const favoriteNotes = allNotes.filter((note) => note.isFavorite).length;

        const categoryIds = new Set(allNotes.map((note) => note.category_id));
        const categories = categoryIds.size;

        // 按分类统计笔记数量
        const categoryNoteCounts = {};
        allNotes.forEach((note) => {
          const categoryId = note.category_id;
          categoryNoteCounts[categoryId] =
            (categoryNoteCounts[categoryId] || 0) + 1;
        });

        const recentNotes = allNotes
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        const categoriesResponse = await getCategories();
        setCategoriesData(categoriesResponse.data);

        // 按创建时间统计笔记数量
        const notesByDate = {};
        allNotes.forEach((note) => {
          const date = new Date(note.created_at).toLocaleDateString();
          notesByDate[date] = (notesByDate[date] || 0) + 1;
        });

        setStats({
          totalNotes,
          favoriteNotes,
          categories,
          recentNotes,
          categoryNoteCounts,
          notesByDate,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const filteredRecentNotes = () => {
    if (!stats || !stats.recentNotes) return [];
    return stats.recentNotes.filter((note) => {
      const title = note.title || '';
      const isMatchTitle = title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const isMatchFavorite =
        filterOption === 'all' ||
        (filterOption === 'favorite' && note.isFavorite);
      const isMatchDate =
        dateRange.length === 0 ||
        (new Date(note.created_at) >= dateRange[0].toDate() &&
          new Date(note.created_at) <= dateRange[1].toDate());
      return isMatchTitle && isMatchFavorite && isMatchDate;
    });
  };

  const renderStats = () => (
    <Row gutter={[24, 24]} className="mb-8 animate-fade-in">
      <Col xs={24} sm={24} md={8}>
        <StatsCard
          title="总笔记数"
          value={stats?.totalNotes || 0}
          prefix={<FileTextOutlined className="text-blue-500" />}
          className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0"
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        />
      </Col>
      <Col xs={24} sm={24} md={8}>
        <StatsCard
          title="收藏笔记"
          value={stats?.favoriteNotes || 0}
          prefix={<StarOutlined className="text-yellow-500" />}
          className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0"
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        />
      </Col>
      <Col xs={24} sm={24} md={8}>
        <StatsCard
          title="分类数量"
          value={stats?.categories || 0}
          prefix={<TeamOutlined className="text-green-500" />}
          className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0"
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        />
      </Col>
    </Row>
  );

  const renderCategoryPieChart = () => {
    if (!stats || !categoriesData) return null;
    const labels = categoriesData.map((category) => category.name);
    const data = labels.map((label) => {
      const categoryId = categoriesData.find((cat) => cat.name === label).id;
      return stats.categoryNoteCounts[categoryId] || 0;
    });

    const pieChartData = {
      labels: labels,
      datasets: [
        {
          label: '笔记数量',
          data: data,
          backgroundColor: [
            'rgba(115, 166, 255, 0.8)', // 更柔和的蓝色
            'rgba(255, 131, 166, 0.8)', // 更柔和的粉色
            'rgba(92, 214, 92, 0.8)', // 更柔和的绿色
            'rgba(255, 188, 82, 0.8)', // 更柔和的黄色
            'rgba(166, 166, 166, 0.8)', // 更柔和的灰色
            'rgba(179, 153, 255, 0.8)', // 更柔和的紫色
          ],
          borderColor: [
            '#73A6FF',
            '#FF83A6',
            '#5CD65C',
            '#FFBC52',
            '#A6A6A6',
            '#B399FF',
          ],
          borderWidth: 2,
        },
      ],
    };

    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right', // 将图例位置改为右侧
          align: 'center', // 图例对齐方式
          labels: {
            font: {
              size: 12,
              family: 'Arial, sans-serif',
              color: '#333',
            },
            padding: 15, // 减小内边距
            usePointStyle: true,
            boxWidth: 8,
          },
        },
        tooltip: {
          bodyFont: {
            size: 12,
            family: 'Arial, sans-serif',
            color: '#333',
          },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
        },
        title: {
          display: true,
          text: '笔记分类统计',
          font: {
            size: 16,
            family: 'Arial, sans-serif',
            weight: 'bold',
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          color: '#333',
        },
      },
    };

    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 h-[500px] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border-0">
        <div className="flex items-center mb-4">
          <PieChartOutlined className="text-blue-500 mr-2 text-xl" />
          <Title level={4} className="m-0">
            分类统计
          </Title>
        </div>
        <Divider className="my-3" />
        <div className="h-[420px] pb-4">
          {' '}
          {/* 添加底部内边距 */}
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    );
  };

  const renderCreationTimeBarChart = () => {
    if (!stats) return null;
    const labels = Object.keys(stats.notesByDate);
    const data = Object.values(stats.notesByDate);

    const barChartData = {
      labels: labels,
      datasets: [
        {
          label: '笔记数量',
          data: data,
          backgroundColor: 'rgba(115, 166, 255, 0.7)', // 更柔和的蓝色
          borderColor: '#73A6FF',
          borderWidth: 2,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(115, 166, 255, 0.9)',
        },
      ],
    };

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
              family: 'Arial, sans-serif',
              color: '#333',
            },
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 12,
              family: 'Arial, sans-serif',
              color: '#333',
            },
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          position: 'top', // 将图例位置改为顶部
          align: 'center', // 图例对齐方式
          labels: {
            font: {
              size: 12,
              family: 'Arial, sans-serif',
              color: '#333',
            },
            usePointStyle: true,
            boxWidth: 8,
            padding: 15, // 减小内边距
          },
        },
        tooltip: {
          bodyFont: {
            size: 12,
            family: 'Arial, sans-serif',
            color: '#333',
          },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#333',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        },
        title: {
          display: true,
          text: '笔记创建时间统计',
          font: {
            size: 16,
            family: 'Arial, sans-serif',
            weight: 'bold',
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          color: '#333',
        },
      },
    };

    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 h-[500px] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border-0">
        <div className="flex items-center mb-4">
          <BarChartOutlined className="text-blue-500 mr-2 text-xl" />
          <Title level={4} className="m-0">
            时间统计
          </Title>
        </div>
        <Divider className="my-3" />
        <div className="h-[420px] pb-4">
          {' '}
          {/* 添加底部内边距 */}
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    );
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Navbar />
      <Content className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full mt-16">
        {user ? (
          <div className="mb-8 animate-fade-in">
            <Title level={2} className="text-center md:text-left mb-2">
              欢迎回来, {user.nickname || user.username}!
            </Title>
            <p className="text-gray-500 text-center md:text-left">
              这里是您的笔记概览，一目了然地查看您的笔记统计和最近活动。
            </p>
          </div>
        ) : (
          <Title
            level={2}
            className="mb-8 text-center md:text-left animate-fade-in"
          >
            欢迎来到笔记应用
          </Title>
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            {renderCategoryPieChart()}
          </Col>
          <Col xs={24} lg={12}>
            {renderCreationTimeBarChart()}
          </Col>
        </Row>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spin tip="加载中..." size="large" />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {user && (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center min-h-[200px]">
                    <Spin tip="加载组件中..." />
                  </div>
                }
              >
                {renderStats()}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                  <div className="flex items-center mb-4">
                    <TeamOutlined className="text-green-500 mr-2 text-xl" />
                    <Title level={4} className="m-0">
                      分类详情
                    </Title>
                  </div>
                  <Divider className="my-3" />
                  <CategoryStats
                    categoryNoteCounts={stats?.categoryNoteCounts}
                    categoriesData={categoriesData}
                  />
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                  <div className="flex items-center mb-4">
                    <FileTextOutlined className="text-blue-500 mr-2 text-xl" />
                    <Title level={4} className="m-0">
                      快捷操作
                    </Title>
                  </div>
                  <Divider className="my-3" />
                  <QuickActions />
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                  <div className="flex items-center mb-4">
                    <StarOutlined className="text-yellow-500 mr-2 text-xl" />
                    <Title level={4} className="m-0">
                      最近笔记
                    </Title>
                  </div>
                  <Divider className="my-3" />
                  <RecentNotes
                    notes={stats?.recentNotes || []}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterOption={filterOption}
                    setFilterOption={setFilterOption}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                  />
                </div>
              </Suspense>
            )}

            {!user && (
              <Card className="text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl border-0 p-8">
                <Title level={4} className="mb-6">
                  请登录以使用全部功能
                </Title>
                <Space size="middle">
                  <Button
                    type="primary"
                    size="large"
                    className="rounded-lg px-8"
                  >
                    <Link to="/login">立即登录</Link>
                  </Button>
                  <Button size="large" className="rounded-lg px-8">
                    <Link to="/register">注册账号</Link>
                  </Button>
                </Space>
              </Card>
            )}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Home;
