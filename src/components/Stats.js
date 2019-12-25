import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { AssetsUnderManagementHelpTooltip } from '../components/ProfileBlock';

const Stats = ({ totalInBTC, totalInUSDT, currentProfit })  => (
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
        <CurrentContractProfit current={currentProfit} />
      </div>
    </Col>
  </Row>
);

function CurrentContractProfit({ current }) {
  return (
    <div className="row-fuild money">
      <Col>
        <div className="description-text">
          <FormattedMessage id="profile.contractCurrentProfit"
            defaultMessage="Profit per current contract:"/>
        </div>
        <div className="value-text" style={{color: '#cfa925'}} >
          {
            current.map((v) => v.toFixed(2) + '%')
              .join(' / ')
          }
        </div>
        ))}
      </Col>
    </div>
  );
}

Stats.defaultProps = {
  currentProfit: [],
};

Stats.propTypes = {
  totalInBTC: PropTypes.number,
  totalInUSDT: PropTypes.number,
  currentProfit: PropTypes.arrayOf(PropTypes.number),
};

export default Stats;
