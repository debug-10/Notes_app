import { Card, Row, Col, Typography, Statistic } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

const CategoryStats = ({ categoryNoteCounts, categoriesData }) => {
  if (!categoryNoteCounts || !categoriesData.length) return null;

  return (
    <Card title="各分类笔记数量" className="mb-6">
      {Object.entries(categoryNoteCounts).map(([categoryId, count]) => {
        const categoryName =
          categoriesData.find((cat) => cat.id === parseInt(categoryId))?.name ||
          `分类 ${categoryId}`;
        return (
          <Row key={categoryId} gutter={8} className="mb-2">
            <Col span={12}>
              <Text>{`${categoryName}:`}</Text>
            </Col>
            <Col span={12}>
              <Statistic value={count} />
            </Col>
          </Row>
        );
      })}
    </Card>
  );
};

CategoryStats.propTypes = {
  categoryNoteCounts: PropTypes.object,
  categoriesData: PropTypes.array.isRequired,
};

export default CategoryStats;
