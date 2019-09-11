import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';


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
    const funds = this.props.funds.filter(fund => fund.exchange === this.props.exchange);
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
              <span>
                <FormattedMessage id="apiKey"
                  defaultMessage="API KEY"/>
              </span><span className="arrow_down"/>
            </div>
            {funds.map(fund => (
              <div
                key={fund._id}
                onClick={e => this.onKeySelect(e, fund)}
                className={classNames('key', {active: this.props.selectedFund && this.props.selectedFund._id === fund._id})}>
                {this.renderFundName(fund)}
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
        <FormattedMessage id="apiKey"
          defaultMessage="API KEY"/>
        {this.props.selectedFund ? ': ' : ''}
        {this.renderFundName(this.props.selectedFund)} <span className="arrow_down"/>
      </span>
    );
  }

  renderFundName(fund) {
    if(!fund) {
      return '';
    } else if(fund.name) {
      return fund.name;
    } else {
      return (
        <FormattedMessage id="userTrustToMe"
          defaultMessage="{name} trusted to me"
          values={{name: fund.from.name}}
        />
      );
    }
  }
}

export default FundSelect;
