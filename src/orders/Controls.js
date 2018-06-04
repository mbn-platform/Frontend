import React from 'react';
import FundSelect from '../terminal/FundSelect';
import DropdownSelect from '../terminal/DropdownSelect';

class Controls extends React.Component {
  render() {
    const funds = this.props.apiKeys.concat(this.props.contracts.filter(contract => contract.to._id === this.props.userId))
    return (
      <div className="row dropdowns pt-2">
        <FundSelect
          container=".orders.container-fluid"
          funds={funds.filter(fund => fund.exchange === this.props.exchange)}
          selectedFund={this.props.fund}
          userId={this.props.userId}
          onApiKeySelect={this.props.onApiKeySelect}
        />
        <DropdownSelect
          selected={this.props.exchange}
          items={['bittrex']}
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
