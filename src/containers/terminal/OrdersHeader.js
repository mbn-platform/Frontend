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
          <Checkbox
            checked={this.props.pairFilterChecked}
            title={this.props.market}
            onToggle={this.props.onPairFilterChange}
          />
        );
      case OrdersHeader.tabs[2]:
        return (
          <Checkbox
            checked={this.props.smallAssetesFilterChecked}
            title='Hide small assets'
            onToggle={this.props.onSmallAssetsFilterChange}
          />
        );
      default:
        return null;
    }
  }
}

OrdersHeader.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  pairFilterChecked: PropTypes.bool.isRequired,
  smallAssetesFilterChecked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onPairFilterChange: PropTypes.func.isRequired,
  onSmallAssetsFilterChange: PropTypes.func.isRequired,
};
