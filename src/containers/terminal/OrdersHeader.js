import React from 'react';
import { Row } from 'reactstrap';
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
      </Row>
    );
  }
}
