import React from 'react';
import { Popover } from 'reactstrap';
import { connect } from 'react-redux';
import { selectMarket, updateRates } from '../actions/terminal';
import MarketTable from './MarketSelectTable';

class MarketSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  onOutsideClick() {
    this.setState({isOpen: false});
  }

  onItemSelect(item) {
    this.setState({isOpen: false});
    this.props.onItemSelect(item);
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.isOpen && this.state.isOpen) {
      document.addEventListener('click', this.onOutsideClick);
    }
    if(prevState.isOpen && !this.state.isOpen) {
      document.removeEventListener('click', this.onOutsideClick);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  render() {
    return(
      <div
        onClick={() => {
          this.setState({isOpen: !this.state.isOpen});
        }}
        id={this.props.targetId} className="dropdown-link-wrap"
      >
        <div className="dropdown-link">
          <span>{this.props.market.split('-').reverse().join('/')} <span className="arrow_down"/></span>
        </div>
        <Popover
          container=".terminal.container-fluid"
          innerClassName="popover-body"
          isOpen={this.state.isOpen}
          target={this.props.targetId}
          placement="top-start"
          className="dropdown-popover market-select"
        >
          <MarketTable
            apiKey={this.props.apiKey}
            market={this.props.market}
            markets={this.props.exchangeInfo.markets}
            rates={this.props.exchangeInfo.rates}
            onMarketSelect={this.props.selectMarket}
            close={e => this.setState({isOpen: false})}
          />
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  apiKey: state.terminal.apiKey,
  market: state.terminal.market,
  exchangeInfo: state.exchangesInfo[state.terminal.exchange] || {},
});

const mapDispatchToProps = dispatch => ({
  selectMarket: market => dispatch(selectMarket(market)),
  updateRates: () => dispatch(updateRates()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MarketSelect);
