import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { Tab } from './Tab';

export class OrdersHeader extends React.PureComponent {

  static tabs = [
    'terminal.orders.openOrders',
    'terminal.orders.closedOrders',
  ]

  state = {
    selectedTab: 'open',
  }

  render() {
    const { selectedTab, onClick } = this.props;
    return (
      <Row className="orders-header">
        {OrdersHeader.tabs.map((t) => (
          <Tab key={t} title={t} selected={selectedTab === t} onClick={() => onClick(t)} />
        ))}
        <Checkbox
          checked={this.props.pairFilterChecked}
          title={this.props.market}
          onToggle={this.props.onPairFilterChange}
        />
      </Row>
    );
  }
}

OrdersHeader.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onPairFilterChange: PropTypes.func.isRequired,
};

class Checkbox extends React.PureComponent {o

  onChange = (e) => {
    this.props.onToggle(!this.props.checked);
  }

  render() {
    return (
      <Col className='checkbox'>
        <label>
          <input type="checkbox" checked={this.props.checked} onChange={this.onChange}/>
          {this.props.title}
        </label>
      </Col>
    );
  }

}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
};
