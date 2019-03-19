import React from 'react';
import { Row } from 'reactstrap';
import { Tab } from '../Tab';

export class PlaceOrderHeader extends React.PureComponent {

  static tabs = [
    'limit',
    // 'market',
    'stop-limit',
    // 'stop-market',
  ]

  render() {
    const { selectedTab, onClick } = this.props;
    return (
      <Row className="orders-header">
        {PlaceOrderHeader.tabs.map((t) => (
          <Tab key={t} title={'terminal.placeOrder.' + t} selected={selectedTab === t} onClick={() => onClick(t)} />
        ))}
      </Row>
    );
  }
}
