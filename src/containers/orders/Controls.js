import React from 'react';
import FundSelect from '../../components/FundSelect';
import DropdownSelect from '../../components/DropdownSelect';

class Controls extends React.Component {
  render() {
    const funds = this.props.apiKeys.concat(this.props.contracts.filter(contract => contract.to._id === this.props.userId))
    return (
      <div className="row dropdowns pt-2">
        <FundSelect
          container=".orders.container-fluid"
          exchange={this.props.exchange}
          funds={funds}
          selectedFund={this.props.fund}
          userId={this.props.userId}
          onApiKeySelect={this.props.onApiKeySelect}
        />
        <DropdownSelect
          selected={this.props.exchange}
          items={this.props.exchanges}
          targetId="exchange_select"
          elementClassName="exchange__switch"
          dropdownClassName="exchange"
          onItemSelect={this.props.onExchangeSelect}
        />
      </div>
    );
  }
}

export default Controls;
