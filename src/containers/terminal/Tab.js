import React from 'react';
import classNames from 'classnames';
import { Col, Row } from 'reactstrap';

export class Tab extends React.PureComponent {
  render() {
    const { title, selected, onClick } = this.props;
    return (
      <Col onClick={onClick} xs="auto" className={classNames('tab', {selected})}>
        {title}
      </Col>
    );
  }
}

export class OrdersHeaders extends React.PureComponent {

  static tabs = [
    'openorders',
    'closedorders',
  ]

  state = {
    selectedTab: 'open',
  }

  render() {
    const { selectedTab, onClick } = this.props;
    return (
      <Row className="orders-header">
        {OrdersHeaders.tabs.map((t) => (
          <Tab key={t} title={t} selected={selectedTab === t} onClick={() => onClick(t)} />
        ))}
      </Row>
    );
  }
}
