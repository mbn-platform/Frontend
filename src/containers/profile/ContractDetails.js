import React from 'react';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import { injectIntl, FormattedMessage } from 'react-intl';

import LockButton from 'components/LockButton';

const ContractDetails = ({
  fee,
  roi,
  auth,
  amount,
  maxLoss,
  duration,
  currency,
  availableForOffers,
  onOfferSendClick,
  intl,
}) => (
  <div className="row-fluid request-sent-block">
    <div className="container-fluid">
      {availableForOffers && (
        <InvestNowButton auth={auth} onClick={onOfferSendClick} />
      )}
      {availableForOffers && <InvestNowDescriptionMobile />}
      <div className="row justify-content-start justify-content-md-center request-sent-title">
        <div className="col-auto text-center align-middle request-sent-title-text title-text">
          <span className="d-inline-block d-md-none icon icon-details icon-006-wrench"/>
          <FormattedMessage
            id="dashboard.contractDetails"
            defaultMessage="contract details"
          />
        </div>
      </div>
      <div className="row justify-content-between request-sent-info">
        <div className="container-fluid">
          <ContractDetailRow
            name={intl.messages['profile.durationOfContractInDetails']}
            value={duration}
            dim="days"
          />
          <ContractDetailRow
            name={intl.messages['profile.currencyOfContractInDetails']}
            value={currency}
            color={currency}
          />
          <ContractDetailRow
            name={intl.messages['profile.minContractAmount']}
            value={amount}
            dim={currency}
            color={currency}
          />
          <ContractDetailRow
            name={intl.messages['profile.targetProfitInDetails']}
            value={roi}
            dim="%"
          />
          <ContractDetailRow
            name={intl.messages['profile.maxLossInDetails']}
            value={maxLoss}
            dim="%"
          />
          <ContractDetailRow
            name={intl.messages['profile.feeInDetails']}
            value={fee}
            dim="%"
          />
        </div>
      </div>
    </div>
  </div>
);

const InvestNowDescriptionMobile = () => (
  <div className="row justify-content-center d-flex d-md-none">
    <div className="col-auto">
      <div className="popover-send-text">
        <FormattedMessage
          id="profile.acceptOrDeclineRequest"
          defaultMessage="YOUR REQUEST WILL BE ACCEPTED OR DECLINED WITHIN 24H" />
      </div>
    </div>
  </div>
);

const InvestNowButton = ({ auth, onClick }) => (
  <div className="row justify-content-center m-top-40">
    <div className="col-auto">
      {auth.loggedIn ? (
        <LockButton
          offsetTop="3px"
          offsetLeft="-30px"
          {...auth.profile.billing.trustManagement}
        >
          <button onClick={onClick} type="button" className="send-request-btn btn btn-secondary active">
            <FormattedMessage
              id="profile.sendRequest"
              defaultMessage="INVEST NOW" />
            <span id="help-icon-send-request" className="d-none d-md-inline-block icon icon-help icon-help-web-button" />
          </button>
        </LockButton>
      ) : (
        <button onClick={onClick} type="button" className="send-request-btn btn btn-secondary active">
          <FormattedMessage
            id="profile.sendRequest"
            defaultMessage="INVEST NOW" />
          <span id="help-icon-send-request" className="d-none d-md-inline-block icon icon-help icon-help-web-button" />
        </button>
      )}
      <UncontrolledTooltip target="help-icon-send-request" placement="right">
        <FormattedMessage
          id="profile.yourRequestWillBe"
          defaultMessage="YOUR REQUEST WILL BE" />
        <span className='green'>
          <FormattedMessage
            id="profile.accepted"
            defaultMessage=" ACCEPTED " />
        </span>
        <FormattedMessage
          id="profile.or"
          defaultMessage="OR" />
        <span className='red'>
          <FormattedMessage
            id="profile.declined"
            defaultMessage="DECLINED" />
        </span>
        <FormattedMessage
          id="profile.within24h"
          defaultMessage="WITHIN 24H" />
      </UncontrolledTooltip>
    </div>
  </div>
);

const ContractDetailRow = ({ name, value, dim, color }) => (
  <div className="row d-flex justify-content-between request-sent-info-item">
    <div className="col-7 col-md-auto">
      <div className="left-info">{name}</div>
    </div>
    <div className="col-auto d-block d-none gap"/>
    <div className="col col-md-auto">
      <div className={classNames('right-info', color && color.toLowerCase())}>
        {value} <span className="attribute">{dim}</span>
      </div>
    </div>
  </div>
);

export default injectIntl(ContractDetails);
