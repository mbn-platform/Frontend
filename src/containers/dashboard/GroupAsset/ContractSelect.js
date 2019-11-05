import React from 'react';
import PropTypes from 'prop-types';

class ContractsSelect extends React.Component {
  static propTypes = {
    defaultPlaceholder: PropTypes.string,
    titleClass: PropTypes.string,
    itemClass: PropTypes.string,
  };

  static defaultProps = {
    defaultPlaceholder: '',
    titleClass: '',
    itemClass: '',
  };

  formatContractString = ({ from, contractSettings, startDt }) => {
    const startDate = new Date(startDt);
    const endDate = new Date(startDate.getTime() + contractSettings.duration * 86400000);
    const [yyyy, mm, dd] = endDate.toISOString().substr(0,10).split('-');

    return (
      `${from.name} ${contractSettings.sum} ${contractSettings.currency} ${dd}.${mm}.${yyyy}`
    );
  };

  render = () => {
    const {
      titleClass, contract, defaultPlaceholder, showAllOption,
    } = this.props;

    return (
      <div className="add_keys_select_wr">
        <div className={`add_keys_select_value upper upper ${titleClass}`}>
          {contract ? this.formatContractString(contract) : defaultPlaceholder}
          <div className="add_keys_select_value_bg" />
        </div>
        <div className="add_keys_select_values_list_wr overflow_y_auto">
          <ul className="add_keys_select_ul">
            {showAllOption && (
              <li
                value={defaultPlaceholder}
                key={defaultPlaceholder}
                className="add_keys_select_li"
                onClick={this.props.onChange}
              >
                {defaultPlaceholder}
              </li>
            )}
            {this.renderContracts()}
          </ul>
        </div>
      </div>
    );
  }

  renderContracts = () => {
    const { contracts, itemClass } = this.props;

    return contracts.map(contract => (
      <li
        value={this.formatContractString(contract)}
        key={contract._id}
        className={`add_keys_select_li upper ${itemClass}`}
        onClick={this.props.onChange(contract)}
      >
        {this.formatContractString(contract)}
      </li>
    ));
  }
}

export default ContractsSelect;
