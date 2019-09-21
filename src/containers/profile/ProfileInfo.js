import React from 'react';
import { NavLink } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import Stats from '../../components/Stats';
import ContractSettings from './ContractSettings';
import SendRequestBlock from './SendRequestBlock';

class ProfileInfo extends React.Component {

  getHeader() {
    return (
      <Row className="justify-content-center">
        <Col xs="12" className="text-center align-middle info-screen-title title-text">
          @{this.props.profile.name}
        </Col>
        {this.props.own && (
          <Col xs="12" className="text-center align-middle info-screen-title">
            <NavLink className="upgrade-to-text" to="/tariffs">
              <FormattedMessage
                id="profile.upgradeTo"
                values={{ tariff: 'premium' }} // TODO: add tariff dynamically
              />
            </NavLink>
          </Col>
        )}
      </Row>
    );
  }

  getHeaderSeparator() {
    return (
      <Row className="justify-content-center">
        <Col md="12" lg="12" xl="12" style={{display: (this.props.profile.available ? 'block' : 'none')}} className="accept-request-title-block">
          <div className="accept-request-title-text">
            <FormattedMessage
              id="profile.acceptingRequests"
              defaultMessage="accepting requests"
            />
          </div>
        </Col>
        <Col md="12" lg="12" xl="12" style={{display: (!this.props.profile.available ? 'block' : 'none')}}  className="no-accept-request-title-block">
          <div className="no-accept-request-title-text">
            <FormattedMessage
              id="profile.notAcceptingRequests"
              defaultMessage="not Accepting requests"
            />
          </div>
        </Col>
      </Row>
    );
  }

  render() {
    const profile = this.props.profile;
    const contractSettings = profile.contractSettings;
    if(this.props.own) {
      return (
        <Col xs="12" md="auto" sm="12" className="info-screen contract-block">
          <Container fluid>
            <Row className="justify-content-center">
              <Col xs="12">
                {this.getHeader()}
                {this.getHeaderSeparator()}
                <Stats
                  traderRating={profile.topTraders}
                  investorRating={profile.topInvesters}
                  averageCurrent={profile.averageCurrent}
                  roiInBTC={profile.roiInBTC}
                  currentProfit={profile.currentProfit}
                  roiInUSD={profile.roiInUSD}
                  totalInBTC={profile.totalInBTC}
                  totalInUSDT={profile.totalInUSDT}
                />
                <ContractSettings
                  onSaveChangesClick={this.props.onSaveChangesClick}
                  onToggleClick={this.props.onToggleClick}
                  duration={contractSettings.duration}
                  amount={contractSettings.minAmount}
                  currency={contractSettings.currency}
                  maxLoss={contractSettings.maxLoss}
                  roiInBTC={profile.roiInBTC}
                  roiInUSD={profile.roiInUSD}
                  fee={contractSettings.fee}
                  availableForOffers={profile.available}
                  roi={contractSettings.roi}
                  tariff={this.props.billing.tariff}
                />
              </Col>
            </Row>
          </Container>
        </Col>
      );
    } else {
      return (
        <Col xs="12" md="auto" sm="12" className="info-screen contract-block">
          <Container fluid>
            <Row className="justify-content-center">
              <Col xs="12">
                {this.getHeader()}
                {this.getHeaderSeparator()}
                <Stats
                  traderRating={profile.topTraders}
                  investorRating={profile.topInvesters}
                  roi={15}
                  currentProfit={profile.currentProfit}
                  averageCurrent={profile.averageCurrent}
                  roiInBTC={profile.roiInBTC}
                  roiInUSD={profile.roiInUSD}
                  totalInBTC={profile.totalInBTC}
                  totalInUSDT={profile.totalInUSDT}
                />
                <About info={profile.info} />
                <SendRequestBlock profile={profile} />
              </Col>
            </Row>
          </Container>
        </Col>
      );
    }
  }
}

function About({info}) {
  if (!info) {
    return null;
  } else {
    return (
      <Row style={{
        marginTop: '39px',
        color: '#bfbfc1',
        textAlign: 'center',
      }}
      className="justify-content-center profile-about">
        <Col style={{textTransform: 'uppercase', fontSize: '1.7em'}} xs="12">About</Col>
        <Col style={{fontSize: '1.5em', wordBreak: 'break-word', padding: '0 10px'}} xs="12">{info}</Col>
      </Row>
    );
  }
}


export default ProfileInfo;
