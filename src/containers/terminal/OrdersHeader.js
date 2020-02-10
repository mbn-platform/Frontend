import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';

import { Tab } from './Tab';
import Checkbox from '../../components/Checkbox';

export class OrdersHeader extends React.PureComponent {

  static tabs = [
    'terminal.orders.openOrders',
    'terminal.orders.closedOrders',
    'terminal.orders.balances',
  ]

  render() {
    const { selectedTab, onClick } = this.props;
    return (
      <Row className="orders-header">
        {OrdersHeader.tabs.map((t) => (
          <Tab key={t} title={t} selected={selectedTab === t} onClick={() => onClick(t)} />
        ))}
        {this.renderCheckboxes()}
      </Row>
    );
  }

  renderCheckboxes() {
    switch (this.props.selectedTab) {
      case OrdersHeader.tabs[0]:
      case OrdersHeader.tabs[1]:
        return (
          <React.Fragment>
            <Checkbox
              name="pair"
              checked={this.props.pairChecked}
              title={this.props.market}
              onChange={this.props.onToggle}
            />
            <Checkbox
              name="filled"
              checked={this.props.filledChecked}
              title={{ id: 'terminal.filled' }}
              onChange={this.props.onToggle}
            />
          </React.Fragment>
        );
      case OrdersHeader.tabs[2]:
        return (
          <Checkbox
            name="smallAssets"
            checked={this.props.smallAssetsChecked}
            title='Hide small assets'
            onChange={this.props.onToggle}
          />
        );
      default:
        return null;
    }
  }
}

OrdersHeader.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  pairChecked: PropTypes.bool.isRequired,
  smallAssetsChecked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};
