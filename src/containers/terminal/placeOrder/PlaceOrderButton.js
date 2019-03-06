import React from 'react';
import { Button } from 'reactstrap';
import classNames from 'classnames';
import { TAB_SELL } from './BuySellSwitch';

export class PlaceOrderButton extends React.PureComponent {
  render() {
    const { tab, amount, currency, price, onClick } = this.props;
    return (
      <Button
        className={classNames('buysell__form-submit', tab === TAB_SELL ? 'sell' : 'buy')}
        onClick={onClick}
      >
        {tab} {currency} {amount} @ {price}
      </Button>
    );
  }
}
