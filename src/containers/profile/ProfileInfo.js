import React from 'react';
import { NavLink } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import Stats from '../../components/Stats';
import ContractSettings from './ContractSettings';
import SendRequestBlock from './SendRequestBlock';

class ProfileInfo extends React.Component {
  getHeader() {
    const { tariff } = this.props.profile;

    return (
      <Row className="justify-content-center">
        <Col xs="12" className="text-center align-middle info-screen-title title-text">
          @{this.props.profile.name}
        </Col>
        <TariffHeader tariff={tariff} own={this.props.own} />
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
    const { profile } = this.props;
    const { contractSettings } = profile;

    if(this.props.own) {
      return (
        <Col xs="12" md="auto" sm="12" className="info-screen contract-block">
          <Container fluid>
            <Row className="justify-content-center">
              <Col xs="12">
                {this.getHeader()}
                {this.getHeaderSeparator()}
                <Stats {...profile} />
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
                  billing={this.props.auth.profile.billing}
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
                <Stats {...profile} />
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

const TariffHeader = ({tariff, own}) => {
  if (!tariff) {
    return null;
  } else if (own) {
    switch (tariff) {
      case 'free':
        return (
          <Col xs="12" className="text-center align-middle info-screen-title">
            <NavLink className="upgrade-to-text" to="/tariffs">
              <FormattedMessage
                id="profile.upgradeServicePlan"
              />
            </NavLink>
          </Col>
        );
      case 'premium':
        return (
          <Col xs="12" className="text-center align-middle info-screen-title">
            <NavLink className="upgrade-to-text" to="/tariffs">
              Premium
            </NavLink>
          </Col>
        );
      default:
        return (
          <Col xs="12" className="text-center align-middle info-screen-title">
            <NavLink className="upgrade-to-text" to="/tariffs">
              <div className="status-icon"/> Pro
            </NavLink>
          </Col>
        );
    }
  } else {
    switch (tariff) {
      case 'free':
        return (
          <Col xs="12" className="text-center align-middle info-screen-title">
            <div className="upgrade-to-text">
              Free user
            </div>
          </Col>
        );
      case 'premium':
        return (
          <Col xs="12" className="text-center align-middle info-screen-title">
            <div className="upgrade-to-text">
              Premium
            </div>
          </Col>
        );

      default:
        return (
          <Col xs="12" className="text-center align-middle info-screen-title">
            <div className="upgrade-to-text">
              <div className="status-icon"/> Pro
            </div>
          </Col>
        );
    }
  }
};

export default ProfileInfo;
