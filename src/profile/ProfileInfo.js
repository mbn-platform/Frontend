import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import RatingBar from './RatingBar';
import Stats from './Stats';
import PropTypes from 'prop-types';
import ContractSettings from './ContractSettings';
import ContractDetails from './ContractDetails';
import SelectApiKey from './SelectApiKey';

class ProfileInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.switchApiKeysView = this.switchApiKeysView.bind(this);
    this.onSendOfferClick = this.onSendOfferClick.bind(this);
    this.onApiKeySelected = this.onApiKeySelected.bind(this);
  }

  onSendOfferClick() {
    if(!this.state.selectedApiKey) {
      alert('Select api key first');
      return
    }
    const keyId = this.state.selectedApiKey._id;
    const offer = {
      keyId,
      to: this.props._id,
      amount: this.props.minAmount,
      currency: this.props.minAmountCurrency,
      maxLoss: this.props.maxLoss,
      fee: this.props.fee,
      duration: this.props.duration,
    };
    this.props.sendOffer(offer);
  }

  onApiKeySelected(selectedApiKey) {
    this.setState({selectedApiKey});
  }

  switchApiKeysView() {
    if(this.state.showSelectApiKey) {
      this.setState({
        showSelectApiKey: false,
        selectedApiKey: null
       });
    } else {
      this.setState({showSelectApiKey: true});
    }
  }

  getHeader() {
    return (
      <Row className="justify-content-center">
        <Col xs="12" className="text-center align-middle info-screen-title title-text">
          @{this.props.name}
        </Col>
      </Row>
    );
  }

  getHeaderSeparator() {
    return (
      <Row className="justify-content-center">
        <Col md="12" lg="12" xl="12" className="separate-block">
          <div className="separate-line d-none d-md-block"></div>
        </Col>
        <Col md="12" lg="12" xl="12" className="d-none accept-request-title-block">
          <div className="accept-request-title-text">accepting requests</div>
        </Col>
        <Col md="12" lg="12" xl="12" className="d-none no-accept-request-title-block">
          <div className="no-accept-request-title-text">not Accepting requests</div>
        </Col>
      </Row>
    );
  }

  render() {
    if(this.props.own) {
      return (
        <Col xs="12" md="auto" sm="12" className="item-screen info-screen contract-block">
          <Container fluid>
            <Row className="justify-content-center">
              <Col xs="12">
                {this.getHeader()}
                {this.getHeaderSeparator()}
                <RatingBar rating={2}/>
                <Stats
                  traderRating={this.props.topTraders}
                  investorRating={this.props.topInvesters}
                  roi={16}
                  moneyInManagement={20000}
                />
                <ContractSettings
                  onSaveChangesClick={this.props.onSaveChangesClick}
                  duration={this.props.duration}
                  amount={this.props.minAmount}
                  currency={this.props.minAmountCurrency}
                  maxLoss={this.props.maxLoss}
                  fee={this.props.fee}
                  availableForOffers={this.props.availableForOffers}
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
                <RatingBar rating={2}/>
                <Stats
                  traderRating={this.props.topTraders}
                  investorRating={this.props.topInvesters}
                  roi={16}
                  moneyInManagement={20000}
                />
                {
                  this.state.showSelectApiKey ?
                    <SelectApiKey
                      onOfferSendClick={this.onOfferSendClick}
                      exchanges={this.props.exchanges}
                      apiKeys={this.props.apiKeys}
                      selectedApiKey={this.state.selectedApiKey}
                      onCancelClick={this.switchApiKeysView}
                      onSendOfferClick={this.onSendOfferClick}
                      onApiKeySelected={this.onApiKeySelected}
                    /> :
                    <ContractDetails
                      onOfferSendClick={this.switchApiKeysView}
                      duration={this.props.duration}
                      amount={this.props.minAmount}
                      currency={this.props.minAmountCurrency}
                      maxLoss={this.props.maxLoss}
                      fee={this.props.fee}
                    />
                }
              </Col>
            </Row>
          </Container>
        </Col>
      );
    }
  }
}

ProfileInfo.propTypes = {
  name: PropTypes.string.isRequired
};


export default ProfileInfo;
