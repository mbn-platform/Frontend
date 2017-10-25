import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row, Col } from 'reactstrap';

class ContractSettings extends React.Component {

  constructor(props) {
    super(props);
    this.onToggleClick = this.onToggleClick.bind(this);
    this.state = {
      acceptsRequests: false,
      isEditing: false,
      duration: props.duration,
      amount: props.amount,
      currency: props.currency,
      maxLoss: props.maxLoss,
      fee: props.fee
    };
    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.onFieldEdit = this.onFieldEdit.bind(this);
    this.onCurrencySelected = this.onCurrencySelected.bind(this);
  }

  onCurrencySelected(e) {
    this.setState({currency: e.target.name})
  }

  onFieldEdit(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onEditButtonClick() {
    const isEditing = this.state.isEditing;
    if(isEditing) {
      const update = {
        fee: parseInt(this.state.fee),
        minAmount: parseInt(this.state.amount),
        minAmountCurrency: this.state.currency,
        maxLoss: parseInt(this.state.maxLoss),
        duration: parseInt(this.state.duration),
      };
      this.props.onSaveChangesClick(update);
    }
    this.setState({isEditing: !this.state.isEditing});
  }

  onToggleClick(e) {
    this.setState({acceptsRequests: !this.state.acceptsRequests});
  }

  renderAcceptsRequests() {
    return (
      <Row className="row accept-requests">
        <Col xs="12" className="align-middle">
          <Row className="justify-content-between accept-block">
            <Col xs="auto" className="text">ACCEPT REQUESTS?</Col>
            <Col xs="auto" className="switch">
              <input className="cmn-toggle cmn-toggle-round-flat" type="checkbox" checked={this.state.acceptsRequests}/>
              <label onClick={this.onToggleClick} className="cmn-toggle-background"/>
              <label className="cmn-text cmn-yes-text">YES</label>
              <label className="cmn-text cmn-no-text">NO</label>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  renderDurationAndAmount() {
    return (
      <Col xs="auto" lg="12" xl="12">
        <div className="duration-block edit-money-block">
          <div className="description-text">DURATION OF CONTRACT:</div>
          <div className="value-text days-text-block text-block">
            {this.props.duration} <span className="days">DAYS</span>
          </div>
          <div className="days-input-block input-block">
            <div className="input-group">
              <input
                onChange={this.onFieldEdit}
                name="duration"
                value={this.state.duration}
                type="text" className="form-control"
                placeholder="45" aria-label="45"
              />
              <span className="input-group-btn">
                <button className="btn btn-secondary" type="button">days</button>
              </span>
            </div>
          </div>
        </div>
        <div className="amount-block edit-money-block">
          <div className="description-text">MIN CONTRACT AMOUNT:</div>
          <div className="value-text amount-text-block text-block">{this.props.amount} <span className="days">{this.props.currency}</span>
          </div>
          <div className="amount-input-block input-block">
            <div className="input-group">
              <input
                onChange={this.onFieldEdit}
                name="amount"
                value={this.state.amount}
                type="text" className="form-control"
                placeholder="4000" aria-label="4000"
              />
              <span className="input-group-btn">
                <button
                  onClick={this.onCurrencySelected}
                  name="BTC"
                  className={classNames('btn', 'btn-secondary', {active: this.state.currency === 'BTC'})}
                  type="button"
                >BTC</button>
                <button
                  onClick={this.onCurrencySelected}
                  name="USDT"
                  className={classNames('btn', 'btn-secondary', {active: this.state.currency === 'USDT'})}
                  type="button"
                >USDT</button>
              </span>
            </div>
          </div>
        </div>
      </Col>
    );
  }

  renderMaxLossAndFee() {
    return (
      <Col xs="auto" lg="12" xl="12">
        <div className="loss-block edit-money-block">
          <div className="description-text">MAX LOSS:</div>
          <div className="value-text loss-text-block text-block">{this.props.maxLoss} <span className="days">%</span></div>
          <div className="loss-input-block  input-block">
            <div className="input-group">
              <input
                onChange={this.onFieldEdit}
                name="maxLoss"
                value={this.state.maxLoss}
                type="text" className="form-control"
                placeholder="10" aria-label="10"
              />
              <span className="input-group-btn">
                <button className="btn btn-secondary" type="button">%</button>
              </span>
            </div>
          </div>
        </div>
        <div className="fee-block edit-money-block">
          <div className="description-text">FEE:</div>
          <div className="value-text fee-text-block text-block">{this.props.fee} <span className="days">%</span></div>
          <div className="fee-input-block input-block">
            <div className="input-group">
              <input
                onChange={this.onFieldEdit}
                name="fee"
                value={this.state.fee}
                type="text" className="form-control"
                placeholder="15" aria-label="15"
              />
              <span className="input-group-btn">
                <button className="btn btn-secondary" type="button">%</button>
              </span>
            </div>
          </div>
        </div>
      </Col>
    );
  }



  render() {
    const className = classNames('row-fluid','contract-setting-block', {'edit-block': this.state.isEditing});
    return (
      <div className={className}>
        <div className="row title-setting">
          <div className="col-auto text-center align-middle contract-setting-title title-text">
            <span className="icon icon-settings icon-006-wrench"></span>Contract settings
          </div>
        </div>
        {this.renderAcceptsRequests()}
        <div className="row justify-content-between duration-contract">
          {this.renderDurationAndAmount()}
          {this.renderMaxLossAndFee()}
        </div>
        <div className="row justify-content-center d-flex d-md-none tooltip-text-block">
          <div className="tooltip-mobile-box">
            <span className="pointer">*</span>To change your profile please accept or decline all offers in your dashboard
          </div>
        </div>
        <div className="row justify-content-center">
          <button
            onClick={this.onEditButtonClick} type="button"
            className={classNames('edit-btn', 'btn', 'btn-secondary', {active: this.state.isEditing})}
            data-toggle="popover" data-trigger="hover"
            data-content="To change your profile please accept or decline all offers in your dashboard">
            {this.state.isEditing ? 'SAVE CHANGES' : 'EDIT'}
          </button>
        </div>
      </div>
    );
  }

}

export default ContractSettings;
