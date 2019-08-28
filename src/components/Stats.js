import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { UncontrolledTooltip } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { AssetsUnderManagementHelpTooltip } from '../components/ProfileBlock';

/* eslint no-unused-vars: 0 */


const renderInvestorsRank = () => {
  return (
    <div className="row-fuild raiting">
      <Col xs="auto">
        <div className="description-text">
          <FormattedMessage id="rankInInvestorsRating"
            defaultMessage="Rank in investors rating:"/>
        </div>
        <div className="value-text green">
          <span className="number-value-text">#</span><span className="text-underline">{}<hr/></span>
        </div>
      </Col>
    </div>);
};

const renderRankInTrades = () => {
  return (
    <div className="row-fuild raiting">
      <Col xs="auto">
        <div className="description-text">
          <FormattedMessage id="rankInRating"
            defaultMessage="Rank in traders rating:"/>
        </div>
        <div className="value-text">
          <span className="number-value-text">#</span><span className="text-underline">{}<hr/></span>
        </div>
      </Col>
    </div>
  );
};


const Stats = ({ traderRating, investorRating, roiInUSD, roiInBTC, totalInBTC, totalInUSDT, averageCurrent })  => (
  <Row className="justify-content-between raiting-block">
    <Col xs="6" md="6" className="raiting-left-item">
      <div className="container-fuild">
        {/*{renderInvestorsRank()}*/}
        <div className="row-fuild money">
          <div className="col-auto">
            <div className="description-text">
              <FormattedMessage id="moneyInManagement"
                defaultMessage="money in {br} management:"
                values={{br: <br/>}}
              />
              <AssetsUnderManagementHelpTooltip />
            </div>
            <div className="value-text green">
              {(totalInUSDT || 0).toFixed(2)}<span className="currency-value-usd-text">
                &nbsp;usd
              </span>
            </div>
            <div className="description-text btc-text">
              ~{totalInBTC || 0} <span className="currency-value-btc-text">btc</span>
            </div>
          </div>
        </div>
      </div>
    </Col>
    <Col xs="auto" md="6" className="raiting-right-item">
      <div className="content-fuild">
        {renderROI(averageCurrent)}
      </div>
    </Col>
  </Row>
);

const renderROI = (averageCurrent) => {
  if (averageCurrent || averageCurrent === 0) {
    averageCurrent = averageCurrent.toFixed(2);
  }
  return (
    <div className="row-fuild money">
      <Col>
        <div className="description-text">
          <FormattedMessage id="profile.contractCurrentProfit"
            defaultMessage="Profit per current contract:"/>
        </div>
        <div className="value-text" style={{color: '#cfa925'}} >
          {averageCurrent}%
        </div>
      </Col>
    </div>
  );
};

Stats.propTypes = {
  traderRating: PropTypes.number,
  investorRating: PropTypes.number,
  roi: PropTypes.number,
  roiInBTC: PropTypes.number,
  roiInUSD: PropTypes.number,
};

//eslint no-unused-vars: 2

export default Stats;
