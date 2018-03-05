import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import RatingBar from './RatingBar';
import Stats from './Stats';
import PropTypes from 'prop-types';
import ContractSettings from './ContractSettings';
import SendRequestBlock from './SendRequestBlock';

class ProfileInfo extends React.Component {

  getHeader() {
    return (
      <Row className="justify-content-center">
        <Col xs="12" className="text-center align-middle info-screen-title title-text">
          @{this.props.profile.name}
        </Col>
      </Row>
    );
  }

  getHeaderSeparator() {
    return (
      <Row className="justify-content-center">
        <Col md="12" lg="12" xl="12" style={{display: (this.props.profile.availableForOffers ? 'block' : 'none')}} className="accept-request-title-block">
          <div className="accept-request-title-text">accepting requests</div>
        </Col>
        <Col md="12" lg="12" xl="12" style={{display: (!this.props.profile.availableForOffers ? 'block' : 'none')}}  className="no-accept-request-title-block">
          <div className="no-accept-request-title-text">not Accepting requests</div>
        </Col>
      </Row>
    );
  }

  render() {
    const profile = this.props.profile;
    if(this.props.own) {
      return (
        <Col xs="12" md="auto" sm="12" className="item-screen info-screen contract-block">
          <Container fluid>
            <Row className="justify-content-center">
              <Col xs="12">
                {this.getHeader()}
                {this.getHeaderSeparator()}
                <RatingBar rating={0}/>
                <Stats
                  rates={this.props.rates}
                  traderRating={profile.topTraders}
                  investorRating={profile.topInvesters}
                  roiInBTC={profile.roiInBTC}
                  roiInUSD={profile.roiInUSD}
                  moneyInManagement={profile.inManagement}
                />
                <ContractSettings
                  onSaveChangesClick={this.props.onSaveChangesClick}
                  onToggleClick={this.props.onToggleClick}
                  duration={profile.duration}
                  amount={profile.minAmount}
                  currency={profile.minAmountCurrency}
                  maxLoss={profile.maxLoss}
                  roiInBTC={profile.roiInBTC}
                  roiInUSD={profile.roiInUSD}                  
                  fee={profile.fee}
                  availableForOffers={profile.availableForOffers}
                  roi={profile.roi}
                />
              </Col>
            </Row>
          </Container>
        </Col>
      );
    } else {
      return (
        <Col xs="12" md="auto" sm="12" className="item-screen info-screen contract-block">
          <Container fluid>
            <Row className="justify-content-center">
              <Col xs="12">
                {this.getHeader()}
                {this.getHeaderSeparator()}
                <RatingBar rating={0}/>
                <Stats
                  rates={this.props.rates}
                  traderRating={profile.topTraders}
                  investorRating={profile.topInvesters}
                  roi={15}
                  roiInBTC={profile.roiInBTC}
                  roiInUSD={profile.roiInUSD}                        
                  moneyInManagement={profile.inManagement}
                />
                <SendRequestBlock profile={profile} />
              </Col>
            </Row>
          </Container>
        </Col>
      );
    }
  }
}


export default ProfileInfo;
