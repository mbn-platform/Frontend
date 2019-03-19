import React from 'react';
import classNames from 'classnames';
import { Col, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

export class Tab extends React.PureComponent {
  render() {
    const { title, selected, onClick } = this.props;
    return (
      <Col onClick={onClick} xs="auto" className={classNames('tab', {selected})}>
        <FormattedMessage
          id={title}
          defaulMessage={title}
        />
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
