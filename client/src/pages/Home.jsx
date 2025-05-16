import { useState, useEffect, Suspense } from 'react';
import { Layout, Typography, Card, Row, Col, Spin, Space, Button } from 'antd';
import {
  StarOutlined,
  FileTextOutlined,
  TeamOutlined,
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
          className="hover:shadow-lg transition-shadow duration-300"
        />
      </Col>
      <Col xs={24} sm={24} md={8}>
        <StatsCard
          title="收藏笔记"
          value={stats?.favoriteNotes || 0}
          prefix={<StarOutlined className="text-yellow-500" />}
          className="hover:shadow-lg transition-shadow duration-300"
        />
      </Col>
      <Col xs={24} sm={24} md={8}>
        <StatsCard
          title="分类数量"
          value={stats?.categories || 0}
          prefix={<TeamOutlined className="text-green-500" />}
          className="hover:shadow-lg transition-shadow duration-300"
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
            '#73A6FF', // 更柔和的蓝色
            '#FF83A6', // 更柔和的粉色
            '#5CD65C', // 更柔和的绿色
            '#FFBC52', // 更柔和的黄色
            '#A6A6A6', // 更柔和的灰色
            '#B399FF', // 更柔和的紫色
          ],
          borderColor: [
            '#73A6FF',
            '#FF83A6',
            '#5CD65C',
            '#FFBC52',
            '#A6A6A6',
            '#B399FF',
          ],
          borderWidth: 1,
        },
      ],
    };

    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12,
              family: 'Arial, sans-serif',
              color: '#333',
            },
          },
        },
        tooltip: {
          bodyFont: {
            size: 12,
            family: 'Arial, sans-serif',
            color: '#333',
          },
        },
      },
    };

    return (
      <div
        className="bg-white rounded-lg shadow-md p-6 mb-8 h-[400px] transition-shadow duration-300 hover:shadow-xl"
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
      >
        <Pie data={pieChartData} options={pieChartOptions} />
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
          backgroundColor: '#73A6FF', // 更柔和的蓝色
          borderColor: '#73A6FF',
          borderWidth: 1,
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
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            font: {
              size: 12,
              family: 'Arial, sans-serif',
              color: '#333',
            },
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 12,
              family: 'Arial, sans-serif',
              color: '#333',
            },
          },
        },
        tooltip: {
          bodyFont: {
            size: 12,
            family: 'Arial, sans-serif',
            color: '#333',
          },
        },
      },
    };

    return (
      <div
        className="bg-white rounded-lg shadow-md p-6 mb-8 h-[400px] transition-shadow duration-300 hover:shadow-xl"
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
      >
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    );
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Navbar />
      <Content className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full mt-16">
        {user ? (
          <Title
            level={2}
            className="mb-8 text-center md:text-left animate-fade-in"
          >
            欢迎回来, {user.nickname || user.username}!
          </Title>
        ) : (
          <Title
            level={2}
            className="mb-8 text-center md:text-left animate-fade-in"
          >
            欢迎来到笔记应用
          </Title>
        )}

        <Row gutter={24}>
          <Col xs={24} sm={24} md={12}>
            {renderCategoryPieChart()}
          </Col>
          <Col xs={24} sm={24} md={12}>
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
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                  <CategoryStats
                    categoryNoteCounts={stats?.categoryNoteCounts}
                    categoriesData={categoriesData}
                  />
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                  <QuickActions />
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
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
              <Card className="text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <Title level={4} className="mb-6">
                  请登录以使用全部功能
                </Title>
                <Space size="middle">
                  <Button type="primary" size="large">
                    <Link to="/login">立即登录</Link>
                  </Button>
                  <Button size="large">
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
