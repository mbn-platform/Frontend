import React from 'react';
import classNames from 'classnames';
import { getColor, formatBalance } from '../generic/util';
import { FormattedMessage } from 'react-intl';

const ProfitLeft = ({left, currency, progress}) => (
  <div className="time_profit_left_border">
    <div className="profit_left_wrapper clearfix">
      <div className="time_left_title_wr">
        <div className="time_left_title">
          <FormattedMessage id="profileLeft"
            defaultMessage="profit left to complete:"/>
        </div>
      </div>
      <div className="time_left_counts_wrapper">
        <div className="profit_left_count_wr">
          {left == null ? (
            <div className={classNames('profit_left_count', 'green')} />
          ) : (
            <div className={classNames('profit_left_count', getColor(progress))}>
              <span className="profit_left_count_value">{formatBalance(left, currency)}</span> <span className="profit_left_count_valute">{currency}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ProfitLeft;