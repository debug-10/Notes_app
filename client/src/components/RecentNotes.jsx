import {
  Card,
  Input,
  Select,
  DatePicker,
  Typography,
  Tooltip,
  Space,
} from 'antd';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const RecentNotes = ({
  notes,
  searchQuery,
  setSearchQuery,
  filterOption,
  setFilterOption,
  dateRange,
  setDateRange,
}) => {
  const filteredNotes = notes.filter((note) => {
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

  return (
    <Card title="最近笔记" className="mb-6">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div className="flex justify-between gap-4">
          <Input
            placeholder="搜索最近笔记"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            value={filterOption}
            onChange={(value) => setFilterOption(value)}
            style={{ width: 120 }}
          >
            <Option value="all">全部</Option>
            <Option value="favorite">收藏</Option>
          </Select>
          <Tooltip title="按创建时间筛选">
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              allowClear
              suffixIcon={<CalendarOutlined />}
            />
          </Tooltip>
        </div>

        {filteredNotes.length > 0 ? (
          <TransitionGroup>
            {filteredNotes.map((note) => (
              <CSSTransition
                key={note.id}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                <Card key={note.id} size="small" className="mb-2">
                  <Link to={`/notes/${note.id}`}>
                    <Text strong>{note.title}</Text>
                  </Link>
                  <Text type="secondary" className="block">
                    {note.content.substring(0, 50)}...
                  </Text>
                  <div className="mt-2">
                    {note.tags && note.tags.length > 0 && (
                      <div className="mb-1">
                        <Text type="secondary">标签: </Text>
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="mr-2 bg-gray-200 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Text type="secondary">
                      创建时间: {new Date(note.created_at).toLocaleString()}
                    </Text>
                  </div>
                </Card>
              </CSSTransition>
            ))}
          </TransitionGroup>
        ) : (
          <Text type="secondary">暂无最近笔记</Text>
        )}
      </Space>
    </Card>
  );
};

RecentNotes.propTypes = {
  notes: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  filterOption: PropTypes.string.isRequired,
  setFilterOption: PropTypes.func.isRequired,
  dateRange: PropTypes.array.isRequired,
  setDateRange: PropTypes.func.isRequired,
};

export default RecentNotes;
