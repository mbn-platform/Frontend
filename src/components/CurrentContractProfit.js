import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import ProfitSelect from '../containers/profile/ProfitSelect';

class CurrentContractProfit extends React.Component {
  static propTypes = {
    currentProfit: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  state = {
    selectedProfit: this.props.currentProfit[0],
  }

  handleProfitSelect = selectedProfit => {
    this.setState({ selectedProfit });
  };

  render = () => {
    const { currentProfit } = this.props;
    const { selectedProfit } = this.state;

    return (
      <div className="row-fuild money">
        <div className="description-text">
          <FormattedMessage id="profile.profitFor" />
          <ProfitSelect
            targetId="profit-select"
            profits={currentProfit}
            selectedProfit={selectedProfit}
            onItemSelect={this.handleProfitSelect}
          />
          <FormattedMessage id="profile.contract" />
        </div>
        <div className="value-text" style={{color: '#cfa925'}}>
          {`${selectedProfit.percent.toFixed(2)} %`}
        </div>
      </div>
    );
  };
};

export default CurrentContractProfit;
