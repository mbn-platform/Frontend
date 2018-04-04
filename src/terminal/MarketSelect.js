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

  componentDidMount() {
    this.interval = setInterval(this.props.updateRates, 5000);
    this.props.updateRates();
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
    clearInterval(this.interval);
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
          <span>{this.props.selectedMarket.split('-').reverse().join('/')} <span className="arrow_down"/></span>
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
            selectedApiKey={this.props.selectedApiKey}
            selectedMarket={this.props.selectedMarket}
            marketSummaries={this.props.marketSummaries}
            marketNames={this.props.marketNames}
            rates={this.props.rates}
            onMarketSelect={this.props.selectMarket}
            close={e => this.setState({isOpen: false})}
          />
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedApiKey: state.terminal.selectedApiKey,
  selectedMarket: state.terminal.selectedMarket,
  marketSummaries: (state.exchangesInfo.bittrex || {}).summaries || [],
  marketNames: (state.exchangesInfo.bittrex || {}).marketNames || {},
  rates: state.rates,
});

const mapDispatchToProps = dispatch => ({
  selectMarket: market => dispatch(selectMarket(market)),
  updateRates: () => dispatch(updateRates()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MarketSelect);
