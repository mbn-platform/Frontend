import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class RoundSelect extends React.Component {
  static propTypes = {
    onSelectClick: PropTypes.func,
    rounds: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    rounds: [],
    onSelectClick: () => null,
  };


  render() {
    const { onSelectClick, currentValue, path } = this.props;
    return (
      <div className="leaderboard__select-wrapper">
        <div className="leaderboard__select-value">
          {   currentValue === 0 ?
            <FormattedMessage
              id="leaderboard.global"
              defaultMessage="GLOBAL"
            /> : 
            <FormattedMessage
              id="leaderboard.round"
              defaultMessage="Round {count}"
              values={{count: currentValue}}
            /> ||
            <FormattedMessage
              id="leaderboard.selectRound"
              defaultMessage="Place"
            />
          }
          <div className="leaderboard__select-value-bg" />
        </div>
        <div className="leaderboard__select-values-wrapper">
          <div className="leaderboard__select-list-wrapper">
            <a
              href={path}
              onClick={e => {e.preventDefault();onSelectClick(0);}}
              className="leaderboard__select-list-item upper ">
              <FormattedMessage
                id="leaderboard.global"
                defaultMessage="GLOBAL"
              />
            </a>
            {this.renderRound()}
          </div>
        </div>
      </div>
    );
  }

  renderRound() {
    const {rounds, onSelectClick, path} = this.props;
    return rounds.map(round => (
      <a
        href={`${path}?round=${round}`}
        key={round}
        className="leaderboard__select-list-item upper"
        onClick={e => {e.preventDefault();onSelectClick(round);}}
      > <FormattedMessage
          id="leaderboard.round"
          defaultMessage="Round {count}"
          values={{count: round}}
        /></a>
    ));
  }

}

export default RoundSelect;
