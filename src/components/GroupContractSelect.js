import React from 'react';
import { Popover } from 'reactstrap';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

class GroupContractSelect extends React.Component {
  state = { isOpen: false };

  onOutsideClick = () => {
    this.setState({ isOpen: false });
  }

  toggleSelect = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  componentDidUpdate = (_, prevState) => {
    if (!prevState.isOpen && this.state.isOpen) {
      document.addEventListener('click', this.onOutsideClick);
    }
    if (prevState.isOpen && !this.state.isOpen) {
      document.removeEventListener('click', this.onOutsideClick);
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.onOutsideClick);
  }

  onContractSelect = contract => event => {
    event.stopPropagation();
    this.setState({ isOpen: false });

    contract
      ? this.props.onContractSelect(contract)
      : this.props.onAllSelected(this.props.group.name);
  }

  stopPropagation = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  render = () => {
    const { contracts } = this.props;

    return (
      <div onClick={this.toggleSelect} id="popover1" className="dropdown-link-wrap">
        {this.renderSelectedContract()}
        <Popover
          onClick={this.onOutsideClick}
          className="dropdown-popover"
          container={this.props.container}
          placement="bottom-start"
          target="popover1"
          isOpen={this.state.isOpen}
          innerClassName="popover-body"
        >
          <div
            onClick={this.stopPropagation}
            className="dropdown keys"
          >
            <div className="dropdown__name" onClick={this.onOutsideClick}>
              <span>
                <FormattedMessage
                  id="terminal.contracts"
                  defaultMessage="Contract"
                />
              </span>
              <span className="arrow_down"/>
            </div>
            {contracts.map(contract => (
              <div
                key={contract._id}
                onClick={this.onContractSelect(contract)}
                className={classNames('key', {
                  active: this.props.selectedFund && this.props.selectedFund._id === contract._id
                })}>
                {this.renderFundName(contract)}
              </div>
            ))}
            <div
              key="all selected"
              onClick={this.onContractSelect(null)}
              className={classNames('key', { active: !this.props.selectedFund })}>
              {this.renderFundName(null)}
            </div>
          </div>
        </Popover>
      </div>
    );
  }

  renderSelectedContract = () => (
    <span className="dropdown-link">
      <FormattedMessage
        id={'terminal.contracts'}
        defaultMessage="Contract"
      />
        : {this.renderFundName(this.props.selectedFund)}
      <span className="arrow_down" />
    </span>
  );

  renderFundName = (fund) => (
    !fund
      ? 'all selected'
      : (
        <FormattedMessage id="userTrustToMe"
          defaultMessage="{name} trusted to me"
          values={{ name: fund.from.name }}
        />
      )
  )
}

export default GroupContractSelect;
