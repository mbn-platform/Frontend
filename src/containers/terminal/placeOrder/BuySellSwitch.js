import React from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

export const TAB_BUY = 'buy';
export const TAB_SELL = 'sell';

export class BuySellSwitch extends React.PureComponent {
  render() {
    const {selectedTab, onTabClick, currency} = this.props;
    return (
      <ButtonGroup className='d-flex'>
        <Button onClick={() => onTabClick(TAB_BUY)}
          className={classNames('w-100', 'buysell__switch', 'switch-buy', {active: selectedTab === TAB_BUY})}>
          <FormattedMessage id="terminal.buy" defaultMessage="Buy"/> {currency}
        </Button>
        <Button onClick={() => onTabClick(TAB_SELL)}
          className={classNames('w-100', 'buysell__switch', 'switch-sell', {active: selectedTab === TAB_SELL})}
        >
          <FormattedMessage id="terminal.sell" defaultMessage="Sell"/> {currency}
        </Button>
      </ButtonGroup>
    );
  }
}
