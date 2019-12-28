import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import { AssetsUnderManagementHelpTooltip } from '../components/ProfileBlock';

const Stats = ({
  totalInBTC, totalInUSDT, contacts, currentProfit,
})  => (
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
              {(totalInUSDT).toFixed(2)}<span className="currency-value-usd-text">
                &nbsp;usd
              </span>
            </div>
            <div className="description-text btc-text">
              ~{totalInBTC} <span className="currency-value-btc-text">btc</span>
            </div>
          </div>
        </div>
      </div>
    </Col>
    <Col xs="auto" md="6" className="raiting-right-item">
      <div className="content-fuild">
        <CurrentContractProfit
          contacts={contacts}
          currentProfit={currentProfit}
        />
      </div>
    </Col>
  </Row>
);

const CurrentContractProfit = ({ contacts, currentProfit }) => (
  <div className="row-fuild money">
    {!isEmpty(contacts) ? (
      <Col>
        <div className="description-text">
          <FormattedMessage
            id="profile.contractCurrentProfit"
            defaultMessage="Profit per current contract:"
          />
        </div>
        <div className="value-text" style={{color: '#cfa925'}}>
          {/* {
            current.map((v) => v.toFixed(2) + '%')
              .join(' / ')
          } */}
        </div>
      </Col>
    ) : (
      <div className="description-text">
        <FormattedMessage id="profile.noContracts" />
      </div>
    )}
  </div>
);

Stats.defaultProps = {
  contacts: [],
  currentProfit: [],
  totalInBTC: 0,
  totalInUSDT: 0,
};

Stats.propTypes = {
  totalInBTC: PropTypes.number,
  totalInUSDT: PropTypes.number,
  contacts: PropTypes.arrayOf(PropTypes.shape()),
  currentProfit: PropTypes.arrayOf(PropTypes.shape()),
};

export default Stats;
