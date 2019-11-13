import React from 'react';
import { connect } from 'react-redux';

import {
  selectExchange,
  selectFund,
  selectAssetGroup,
} from '../../actions/terminal';
import { getAssetGroups } from '../../actions/assetGroup';
import FundSelect from '../../components/FundSelect';
import DropdownSelect from '../../components/DropdownSelect';

class Controls extends React.Component {
  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  handleGroupSelect = item => {
    const { assetGroups } = this.props;
    const group = assetGroups.find((group) => group.name === item);
    this.props.selectAssetGroup(item);
    this.props.selectExchange(group.exchange);
    this.props.selectFund(group);
  };

  render() {
    const { apiKeys, contracts, userId } = this.props;
    const funds = apiKeys.concat(contracts.filter(contract => contract.to._id === userId));

    return (
      <div className="row dropdowns pt-2">
        <DropdownSelect
          selected={this.props.assetGroup}
          items={this.props.assetGroups.map(({ name }) => name)}
          targetId="asset_groups_select"
          elementClassName="exchange__switch"
          dropdownClassName="asset-groups"
          onItemSelect={this.handleGroupSelect}
        />
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

const mapStateToProps = ({ assetGroups, terminal }) => ({
  assetGroup: terminal.assetGroup,
  assetGroups,
});

const mapDispatchToProps = {
  selectExchange,
  selectFund,
  getAssetGroups,
  selectAssetGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
