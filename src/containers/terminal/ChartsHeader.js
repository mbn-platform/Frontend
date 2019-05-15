import React from 'react';
import { Row } from 'reactstrap';
import { Tab } from './Tab';

export class ChartsHeader extends React.PureComponent {
  static tabs = [
    'tradingView',
    'marketDepth'
  ]

  render() {
    const { selectedTab, onClick } = this.props;
    return (
      <Row className="orders-header">
        {ChartsHeader.tabs.map((t) => (
          <Tab key={t} title={'terminal.charts.' + t}
            selected={selectedTab === t} onClick={() => onClick(t)}
          />
        ))}
      </Row>
    );
  }
}
