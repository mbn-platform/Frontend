import React from 'react';
import './Competition.css';
import binanceLogo from '../../img/binanceLogo.svg';
import CompetitionIcon from '../../img/Competition.svg';

const Competition = () => (
  <a href="https://membrana.io/competition/?utm_source=beta_membrana_mobile&utm_medium=banner&utm_campaign=banner_mobile" className="competition__container">
    <img src={CompetitionIcon} className="competition__icon"/>
    <div className="competition__title">
      <div className="competition__subtitle"><span className="competition__subtitle_underline">Get FREE</span> $100 on</div>
      <div className="competition__subtitle_yellow">
        <img src={binanceLogo} className="competition__binance_logo"/>
        Binance Exchange
      </div>
    </div>
  </a>
);
export default Competition;
