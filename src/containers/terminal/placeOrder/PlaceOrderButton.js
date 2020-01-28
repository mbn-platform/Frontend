import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { Button } from 'reactstrap';
import classNames from 'classnames';
import get from 'lodash/get';

import createMqProvider, { ratingSchema } from '../../../MediaQuery';
import { TAB_SELL, TAB_BUY } from './BuySellSwitch';

const { Screen } = createMqProvider(ratingSchema);

export class PlaceOrderButton extends React.PureComponent {
  static defaultProps = {
    disabled: false,
  }

  static propTypes = {
    disabled: PropTypes.bool,
  }

  buttonRef = React.createRef();

  handleIsSmallText = size => {
    const outerText = get(this.buttonRef, 'current.outerText');

    return (size === 'small' || size === 'md') && outerText && outerText.length > 25;
  };

  render() {
    const {
      tab, amount, currency, price, onClick, disabled,
    } = this.props;

    return (
      <Screen on={size => (
        <Button
          innerRef={this.buttonRef}
          className={classNames('buysell__form-submit', {
            'sell': tab === TAB_SELL,
            'buy': tab === TAB_BUY,
            'small-text': this.handleIsSmallText(size),

          })}
          onClick={onClick}
          disabled={disabled}
        >
          {tab} {currency} {amount} @ {price && BigNumber(price).toFixed()}
        </Button>
      )} />
    );
  }
}
