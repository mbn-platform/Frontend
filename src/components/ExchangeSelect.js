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
    const { exchangesTitleClasses, exchange, defaultPlaceholder } = this.props;
    return (
      <div className="add_keys_select_wr">
        <div className={`add_keys_select_value upper upper ${exchangesTitleClasses}`}>{
          exchange ||  defaultPlaceholder
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
    const {exchanges, exchangesItemClasses } = this.props;
    return exchanges.map((exchange, key) => (
      <li value={exchange}
        key={typeof exchange === 'object' ? key : exchange}
        className={`add_keys_select_li upper ${exchangesItemClasses}`}
        onClick={() => this.onClick(exchange)}
      >{exchange}</li>
    ));
  }
}

export default ExchangeSelect;
