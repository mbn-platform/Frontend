import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import {injectIntl, FormattedMessage} from 'react-intl';

class ContractDetails extends React.Component {

  render() {
    return (
      <div className="row-fluid request-sent-block">
        <div className="container-fluid">
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
                name={this.props.intl.messages['profile.durationOfContractInDetails']}
                value={this.props.duration}
                dim="days"
              />
              <ContractDetailRow
                name={this.props.intl.messages['profile.currencyOfContractInDetails']}
                value={this.props.currency}
              />              
              <ContractDetailRow
                name={this.props.intl.messages['profile.minContractAmount']}
                value={this.props.amount}
                dim={this.props.currency}
              />
              <ContractDetailRow
                name={this.props.intl.messages['profile.targetProfitInDetails']}
                value={this.props.roi}
                dim="%"
              />
              <ContractDetailRow
                name={this.props.intl.messages['profile.maxLossInDetails']}
                value={this.props.maxLoss}
                dim="%"
              />
              <ContractDetailRow
                name={this.props.intl.messages['profile.feeInDetails']}
                value={this.props.fee}
                dim="%"
              />
            </div>
          </div>
          {this.props.availableForOffers ? (
            <div className="row justify-content-center">
              <div className="col-auto">
                <button onClick={this.props.onOfferSendClick} type="button" className="send-request-btn btn btn-secondary active">
                  <FormattedMessage
                    id="profile.sendRequest"
                    defaultMessage="INVEST NOW"
                  />
                  <span id="help-icon-send-request" className="d-none d-md-inline-block icon icon-help icon-help-web-button" />
                </button>
                <UncontrolledTooltip target="help-icon-send-request" placement="right">
                  <FormattedMessage
                    id="profile.yourRequestWillBe"
                    defaultMessage="YOUR REQUEST WILL BE"
                  />
                  <span className='green'>
                    <FormattedMessage
                      id="profile.accepted"
                      defaultMessage=" ACCEPTED "
                    />
                  </span>
                  <FormattedMessage
                    id="profile.or"
                    defaultMessage="OR"
                  />
                  <span className='red'>
                    <FormattedMessage
                      id="profile.declined"
                      defaultMessage="DECLINED"
                    />
                  </span>
                  <FormattedMessage
                    id="profile.within24h"
                    defaultMessage="WITHIN 24H"
                  />
                </UncontrolledTooltip>
              </div>
            </div>
          ) : null}
          {this.props.availableForOffers ? (
            <div className="row justify-content-center d-flex d-md-none">
              <div className="col-auto">
                <div className="popover-send-text">
                  <FormattedMessage
                    id="profile.acceptOrDeclineRequest"
                    defaultMessage="YOUR REQUEST WILL BE ACCEPTED OR DECLINED WITHIN 24H"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

    );
  }
}

const ContractDetailRow = ({ name, value, dim }) => (
  <div className="row d-flex justify-content-between request-sent-info-item">
    <div className="col-7 col-md-auto">
      <div className="left-info">{name}</div>
    </div>
    <div className="col-auto d-block d-none gap"/>
    <div className="col col-md-auto">
      <div className="right-info">{value} <span className="attribute">{dim}</span>
      </div>
    </div>
  </div>
);


export default injectIntl(ContractDetails);
