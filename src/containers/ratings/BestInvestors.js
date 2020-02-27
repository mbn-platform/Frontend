import React from 'react';
import { FormattedMessage } from 'react-intl';

const BestInvestors = () => (
  <div className="ratings-investors ratings__best">
    <ul className="ratings__best-list">
      <li className="ratings__best-item best_alltime">
        <div className="ratings__best-top">
          <div className="time">
            <FormattedMessage
              id="ratings.bestInvestor"
              defaultMessage="All the time best investor"
            />
          </div>
          <div className="nickname">
            <FormattedMessage
              id="ratings.toBeDetermined"
              defaultMessage="to be determined"
            />
          </div>
        </div>
        <div className="ratings__best-bottom">
          <div className="value"/>
          <span className="text">
            <FormattedMessage
              id="ratings.roiPercent"
              defaultMessage="ROI, %"
            />
          </span>
        </div>
      </li>
      <li className="dash"/>
      <li className="ratings__best-item best_year">
        <div className="ratings__best-top">
          <div className="time">
            <FormattedMessage
              id="ratings.bestInvestorOfYear"
              defaultMessage="Best investor of {year}"
              values={{ year: <span className="year">2017</span> }}
            />
          </div>
          <div className="nickname">
            <FormattedMessage
              id="ratings.toBeDetermined"
              defaultMessage="to be determined"
            />
          </div>
        </div>
        <div className="ratings__best-bottom">
          <div className="value"/>
          <span className="text">
            <FormattedMessage
              id="ratings.roiPercent"
              defaultMessage="ROI, %"
            />
          </span>
        </div>
      </li>
      <li className="dash"/>
      <li className="ratings__best-item best_quart">
        <div className="ratings__best-top">
          <div className="time">
            <FormattedMessage
              id="ratings.bestInvestorQuart"
              defaultMessage="Best investor of quart"
            />
          </div>
          <div className="nickname">
            <FormattedMessage
              id="ratings.toBeDetermined"
              defaultMessage="to be determined"
            />
          </div>
        </div>
        <div className="ratings__best-bottom">
          <div className="value"/>
          <span className="text">
            <FormattedMessage
              id="ratings.roiPercent"
              defaultMessage="ROI, %"
            />
          </span>
        </div>
      </li>
      <li className="dash"/>
      <li className="ratings__best-item best_month">
        <div className="ratings__best-top">
          <div className="time">
            <FormattedMessage
              id="ratings.bestInvestorOfMonth"
              defaultMessage="Best investor of {month}"
              values={{ month: <span className="month">January</span> }}
            />
          </div>
          <div className="nickname">
            <FormattedMessage
              id="ratings.toBeDetermined"
              defaultMessage="to be determined"
            />
          </div>
        </div>
        <div className="ratings__best-bottom">
          <div className="value"/>
          <span className="text">
            <FormattedMessage
              id="ratings.roiPercent"
              defaultMessage="ROI, %"
            />
          </span>
        </div>
      </li>
    </ul>
  </div>
);

export default BestInvestors;
