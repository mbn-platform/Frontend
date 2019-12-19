import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import isNull from 'lodash/isNull';

import {
  selectExchange,
  getExchangeMarkets,
  selectMarket,
  selectFund,
  selectAssetGroup,
  selectControlsByExchange,
} from '../../actions/terminal';
import { showInfoModal, closeInfoModal } from '../../actions/modal';
import { getAssetGroups } from '../../actions/assetGroup';
import FundSelect from '../../components/FundSelect';
import GroupContractSelect from '../../components/GroupContractSelect';
import GroupSelect from '../../components/GroupSelect';

import DropdownSelect from '../../components/DropdownSelect';
import Checkbox from '../../components/Checkbox';

class Controls extends React.Component {
  state = {
    assetGroupEnabled: !isNull(this.props.assetGroup),
  };

  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.assetGroup && prevProps.assetGroup !== this.props.assetGroup) {
      this.setState({ assetGroupEnabled: !isNull(this.props.assetGroup) });
    }
  };

  onAssetGroupToggle = checked => {
    if (checked && this.props.assetGroups.length === 0) {
      this.showNoFundsModal();
    } else {
      this.setState({ assetGroupEnabled: checked });
      if (checked) {
        this.handleGroupSelect(this.props.assetGroups[0]._id);
        this.props.onApiKeySelect(null);
      } else {
        this.props.selectAssetGroup(null);
      }
    }
  };

  handleGroupSelect = groupId => {
    const { assetGroups } = this.props;
    const group = assetGroups.find(group => group._id === groupId);

    if (group) {
      this.props.selectAssetGroup(group);
      this.props.selectExchange(group.exchange);
      this.props.getExchangeMarkets(group.exchange);
      this.props.selectMarket(this.props.market);
    }
  };

  handleExchangeSelect = exchange => {
    this.props.selectControlsByExchange(exchange);
    this.props.getExchangeMarkets(exchange);
    this.props.selectMarket(this.props.market);
  }

  handleFundSelect = fund => {
    this.props.selectFund(fund);
    this.props.selectExchange(fund.exchange);
    this.props.getExchangeMarkets(fund.exchange);
    this.props.selectMarket(this.props.market);
  };

  showNoFundsModal = () => {
    this.props.showInfoModal('noAssetGroups', {
      link: (
        <div className="dashboard_link" onClick={this.navigateToDashboard}>
          <FormattedMessage id="dashboard.dashboard" />
        </div>
      ),
    });
  };

  navigateToDashboard = () => {
    this.props.closeInfoModal();
    this.props.history.push('/dashboard/inner');
  };

  render() {
    const { assetGroup, assetGroups, apiKeys, contracts, userId } = this.props;

    let funds;
    if (assetGroup) {
      funds = contracts.filter((c) => assetGroup.contracts.includes(c._id));
    } else {
      funds = apiKeys.concat(contracts.filter(contract => contract.to._id === userId));
    }

    return (
      <div className="row dropdowns pt-2">
        <div className={classNames('asset_groups_checkbox_wr', { 'active': this.state.assetGroupEnabled })}>
          <Checkbox
            checked={this.state.assetGroupEnabled}
            title="Asset Group"
            onToggle={this.onAssetGroupToggle}
          />
          {this.state.assetGroupEnabled && assetGroup && (
            <GroupSelect
              selectedGroup={assetGroup}
              assetGroups={assetGroups}
              targetId="group_select"
              elementClassName="exchange__switch"
              dropdownClassName="exchange"
              onItemSelect={this.handleGroupSelect}
            />
          )}
        </div>
        {this.state.assetGroupEnabled && assetGroup ? (
          <GroupContractSelect
            contracts={funds}
            group={assetGroup}
            selectedFund={this.props.fund}
            onContractSelect={this.props.onApiKeySelect}
          />
        ) : (
          <FundSelect
            title="apiKey"
            funds={funds}
            selectedFund={this.props.fund}
            userId={this.props.userId}
            onApiKeySelect={this.handleFundSelect}
          />
        )}
        <DropdownSelect
          selected={this.props.exchange}
          items={this.props.exchanges}
          targetId="exchange_select"
          elementClassName="exchange__switch"
          dropdownClassName="exchange"
          onItemSelect={this.handleExchangeSelect}
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
  getExchangeMarkets,
  selectMarket,
  selectFund,
  getAssetGroups,
  selectAssetGroup,
  showInfoModal,
  closeInfoModal,
  selectControlsByExchange,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Controls));
