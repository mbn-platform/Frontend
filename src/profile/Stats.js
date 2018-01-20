import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { UncontrolledTooltip } from 'reactstrap';


const Stats = ({ traderRating, investorRating, roiInUSD, roiInBTC, moneyInManagement })  => (
  <Row className="justify-content-between raiting-block">
    <Col xs="auto" className="raiting-left-item">
      <div className="content-fuild">
        <div className="row-fuild raiting">
          <Col xs="auto">
            <div className="description-text">
              Rank in traders rating:
            </div>
            <div className="value-text">
              <span className="number-value-text">#</span><span className="text-underline">{}<hr/></span>
            </div>
          </Col>
        </div>
        <div className="row-fuild money">
          <Col>
            <div className="description-text">
              return on investment (ROI):
            </div>
            <div className="value-text">
              {roiInUSD}<span className="currency-value-usd-text letter-spacing-1"> % in usd</span>

               <span className="icon icon-help icon-help-web-button"  id="help-icon-roi"></span>
              <UncontrolledTooltip target="help-icon-roi">
                ROI CALCULATED BY MERCATUS ANALYSIS SYSTEM
              </UncontrolledTooltip>

            </div>
            <div className="description-text btc-text">
              ~ {roiInBTC} <span className="currency-value-btc-text letter-spacing-1"> % in btc</span>
            </div>            
          </Col>
        </div>
      </div>
    </Col>
    <Col className="col-auto raiting-right-item">
      <div className="container-fuild">
        <div className="row-fuild raiting">
          <Col xs="auto">
            <div className="description-text">
              Rank in investors rating:
            </div>
            <div className="value-text green">
              <span className="number-value-text">#</span><span className="text-underline">{}<hr/></span>
            </div>
          </Col>
        </div>
        <div className="row-fuild money">
          <div className="col-auto">
            <div className="description-text">
              money in <br/> management:
            </div>
            <div className="value-text green">
              {moneyInManagement}<span className="currency-value-usd-text"> usd</span>
            </div>
            <div className="description-text btc-text">
              ~ {moneyInManagement} <span className="currency-value-btc-text">btc</span>
            </div>
          </div>

        </div>
      </div>
    </Col>
  </Row>
);

Stats.propTypes = {
  traderRating: PropTypes.number,
  investorRating: PropTypes.number,
  roi: PropTypes.number,
  roiInBTC: PropTypes.number,
  roiInUSD: PropTypes.number,
  moneyInManagement: PropTypes.number,
};

export default Stats;
