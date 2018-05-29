import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';

class FundSelect extends React.Component {


  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.onKeySelect = this.onKeySelect.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  onOutsideClick() {
    this.setState({isOpen: false});
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

  onKeySelect(e, key) {
    e.stopPropagation();
    this.setState({isOpen: false});
    this.props.onApiKeySelect(key);
  }

  render() {
    return (
      <div onClick={() => this.setState({isOpen: !this.state.isOpen})} id="popover1" className="dropdown-link-wrap">
        {this.renderSelectedFund()}
        <Popover
          onClick={() => this.setState({isOpen: false})}
          className="dropdown-popover"
          container={this.props.container}
          placement="bottom-start"
          target="popover1"
          isOpen={this.state.isOpen}
          innerClassName="popover-body"
        >
          <div
            onClick={e => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            className="dropdown keys">
            <div className="dropdown__name" onClick={this.onOutsideClick}>
              <span>API KEY</span><span className="arrow_down"></span>
            </div>
            {this.props.funds.slice(0, 5).map(fund => (
              <div
                key={fund._id}
                onClick={e => this.onKeySelect(e, fund)}
                className={classNames('key', {active: this.props.selectedFund && this.props.selectedFund._id === fund._id})}>
                {fund.name || `${fund.from.name} trusted to me`}
              </div>
            ))}
          </div>
        </Popover>
      </div>
    );
  }

  renderSelectedFund() {
    return (
      <span className="dropdown-link">
        API KEY{this.props.selectedFund ? ': ' + (this.props.selectedFund.name || `${this.props.selectedFund.from.name} trusted to me`) + ' ' : ' '}<span className="arrow_down"/>
      </span>
    );
  }
}

export default FundSelect;
