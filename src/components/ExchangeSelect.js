import React from 'react';
import PropTypes from 'prop-types';

class ExchangeSelect extends React.Component {

  static propTypes = {
    defaultPlaceholder: PropTypes.string,
    exchangesTitleClasses: PropTypes.string,
    exchangesItemClasses: PropTypes.string,
  };

  static defaultProps = {
    defaultPlaceholder: '',
    exchangesTitleClasses: '',
    exchangesItemClasses: '',
  };

  render() {
    const { exchanges, exchangesTitleClasses, exchange, defaultPlaceholder } = this.props;
    return (
      <div className="add_keys_select_wr">
        <div className={`add_keys_select_value upper upper ${exchangesTitleClasses}`}>{
          exchange && typeof exchanges[0] === 'object' ? 
            exchanges.find(exchangeItem => exchangeItem.value === exchange).label
            : exchange || defaultPlaceholder
        }
        <div className="add_keys_select_value_bg" />
        </div>
        <div className="add_keys_select_values_list_wr">
          <ul className="add_keys_select_ul">
            {this.renderExchanges()}
            {this.renderAllOption()}
          </ul>
        </div>
      </div>
    );
  }

  onClick = e => {
    this.props.onChange(e);
  }

  renderAllOption = () => {
    if(this.props.showAllOption) {
      return (<li
        value="All"
        key="All"
        className="add_keys_select_li"
        onClick={() => this.onClick()}
      >All</li>);
    } else {
      return null;
    }
  }

  renderExchanges= () => {
    const {exchanges, exchange: currentExchange, exchangesItemClasses } = this.props;
    return exchanges.map((exchange, key) => {
      const isCurrentItemObject  = typeof exchange === 'object';
      return (
        <li value={isCurrentItemObject ? exchange.label : exchange}
          key={isCurrentItemObject ? key : exchange}
          className={`add_keys_select_li upper ${exchangesItemClasses} ${exchange === currentExchange && 'active'}`}
          onClick={() => this.onClick(isCurrentItemObject ? exchange.value : exchange)}
        >{isCurrentItemObject ? exchange.label : exchange }</li>
      );
    });
  }
}

export default ExchangeSelect;
