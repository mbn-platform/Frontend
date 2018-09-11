import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Popover } from 'reactstrap';
import classNames from 'classnames';

class RoundSelect extends React.Component {
  static propTypes = {
    onSelectClick: PropTypes.func,
    rounds: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    rounds: [],
    onSelectClick: () => null,
  };

  state = {
    currentValue: this.props.currentValue
  };

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.isOpen && this.state.isOpen) {
      document.addEventListener('click', this.onOutsideClick);
    }
    if(prevState.isOpen && !this.state.isOpen) {
      document.removeEventListener('click', this.onOutsideClick);
    }
  }

  onOutsideClick = () => {
    this.setState({isOpen: false});
  }

  onItemSelect = (e, item) => {
    this.setState({isOpen: false});
    this.props.onItemSelect(item);
  }

  render() {
    const { onSelectClick, currentValue, path } = this.props;
    return (
      <div onClick={() => this.setState({isOpen: !this.state.isOpen})} id={this.props.targetId} className="dropdown-link-wrap">
        <div className="dropdown-link">
          <div>
            { 
              currentValue === 0 ?
                <FormattedMessage
                  id="leaderboard.global"
                  defaultMessage="GLOBAL"
                /> :
                <FormattedMessage
                  id="leaderboard.round"
                  defaultMessage="Round {count}"
                  values={{count: currentValue}}
                />
            }
            <span className="arrow_down"/></div>
        </div>
        <Popover
          onClick={this.onOutsideClick}
          innerClassName="popover-body"
          isOpen={this.state.isOpen}
          target={this.props.targetId}
          placement="bottom-start"
          className="dropdown-popover"
        >
          <div
            onClick={e => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            className={classNames('dropdown', this.props.dropdownClassName)}>
            <div className="dropdown__name leaderboard__select-name" onClick={this.onOutsideClick}>
              <span>{
                currentValue === 0 ?
                  <FormattedMessage
                    id="leaderboard.global"
                    defaultMessage="GLOBAL"
                  /> :
                  <FormattedMessage
                    id="leaderboard.round"
                    defaultMessage="Round {count}"
                    values={{count: currentValue}}
                  />
              }</span><span className="arrow_down"/>
            </div>
            <a
              href={path}
              onClick={e => {
                e.preventDefault();
                this.setState({isOpen: false});
                onSelectClick(0);
              }}
              className={classNames(this.props.elementClassName, {active: currentValue === 0})}>
              <FormattedMessage
                id="leaderboard.global"
                defaultMessage="GLOBAL"
              />
            </a>
            {this.renderRound()}
          </div>
        </Popover>
      </div>
    );
  }

  renderRound() {
    const {rounds, onSelectClick, path, currentValue} = this.props;
    return rounds.map(round => {
      return (
        <a
          href={`${path}?round=${round}`}
          key={round}
          className={classNames(this.props.elementClassName, {active: round === currentValue})}
          onClick={e => {
            e.preventDefault();
            this.setState({isOpen: false});
            onSelectClick(round);
          }
          }
        > <FormattedMessage
            id="leaderboard.round"
            defaultMessage="Round {count}"
            values={{count: round}}
          /></a>
      );
    });
  }

}

export default RoundSelect;
