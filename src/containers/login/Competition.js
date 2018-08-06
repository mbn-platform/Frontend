import React from 'react';
import './Competition.css';
import binanceLogo from '../../assets/svg/binanceLogo.svg';
import CompetitionIcon from '../../assets/img/Competition.png';
import { FormattedMessage } from 'react-intl';

const Competition = () => (
  <a href="https://membrana.io/competition/?utm_source=beta_membrana_mobile&utm_medium=banner&utm_campaign=banner_mobile" className="competition__container">
    <img src={CompetitionIcon} alt="Competition" className="competition__icon"/>
    <div className="competition__title">
      <div className="competition__subtitle">
        <span className="competition__subtitle_underline">
          <FormattedMessage
            id="competition.free"
            defaultMessage="Get FREE"
          /></span>
        <FormattedMessage
          id="competition.prize"
          defaultMessage=" $100 on"
        />
      </div>
      <div className="competition__subtitle_yellow">
        <img src={binanceLogo} alt="binance" className="competition__binance_logo"/>
        <FormattedMessage
          id="competition.binanceExchange"
          defaultMessage="Binance Exchange"
        />
      </div>
    </div>
  </a>
);
export default Competition;
