import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import isNull from 'lodash/isNull';

import {
  selectExchange,
  selectFund,
  selectAssetGroup,
} from '../../actions/terminal';
import { showInfoModal, closeInfoModal } from '../../actions/modal';
import { getAssetGroups } from '../../actions/assetGroup';
import FundSelect from '../../components/FundSelect';
import GroupContractSelect from '../../components/GroupContractSelect';
import GroupSelect from '../../components/GroupSelect';

import DropdownSelect from '../../components/DropdownSelect';
import Checkbox from '../../components/Checkbox';

class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetGroupEnabled: !isNull(props.assetGroup),
    };
  }

  componentDidMount = () => {
    this.props.getAssetGroups();
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
    }
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
            onAllSelected={this.handleGroupSelect}
          />
        ) : (
          <FundSelect
            title={assetGroup ? 'terminal.contracts': 'apiKey'}
            exchange={this.props.exchange}
            funds={funds}
            selectedFund={this.props.fund}
            userId={this.props.userId}
            onApiKeySelect={this.props.onApiKeySelect}
          />
        )}
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
  showInfoModal,
  closeInfoModal,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Controls));
