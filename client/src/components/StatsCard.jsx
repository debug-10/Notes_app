import { Card, Statistic } from 'antd';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

const StatsCard = ({ title, value, prefix }) => (
  <CSSTransition key={title} timeout={300} classNames="fade" unmountOnExit>
    <Card>
      <Statistic title={title} value={value} prefix={prefix} />
    </Card>
  </CSSTransition>
);

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  prefix: PropTypes.node.isRequired,
};

export default StatsCard;
