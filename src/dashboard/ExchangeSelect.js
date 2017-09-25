import React from 'react';

class ExchangeSelect extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  render() {
    return (
      <div className="add_keys_select_wr">
        <div className="add_keys_select_value">{this.props.exchange ? this.props.exchange : 'Exchange' }
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

  onClick(e) {
    this.props.onChange(e);
  }

  renderAllOption() {
    if(this.props.showAllOption) {
      return (<li
        value="All"
        key="All"
        className="add_keys_select_li"
        onClick={() => this.onClick()}
      >All</li>)
    } else {
      return null;
    }
  }

  renderExchanges() {
    return this.props.exchanges.map(exchange => (
      <li value={exchange.name}
        key={exchange.name}
        className="add_keys_select_li"
        onClick={() => this.onClick(exchange)}
      >{exchange.name}</li>
      ));
  }

}

export default ExchangeSelect;
