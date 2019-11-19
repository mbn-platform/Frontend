import BigNumber from 'bignumber.js';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import classNames from 'classnames';
import { TAB_SELL } from './BuySellSwitch';

export class PlaceOrderButton extends React.PureComponent {
  static defaultProps = {
    disabled: false,
  }

  static propTypes = {
    disabled: PropTypes.bool,
  }

  render() {
    const {
      tab, amount, currency, price, onClick, disabled,
    } = this.props;

    return (
      <Button
        className={classNames('buysell__form-submit', tab === TAB_SELL ? 'sell' : 'buy')}
        onClick={onClick}
        disabled={disabled}
      >
        {tab} {currency} {amount} @ {price && BigNumber(price).toFixed()}
      </Button>
    );
  }
}
