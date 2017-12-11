import React from 'react';
import classNames from 'classnames';
import { Row, Col } from 'reactstrap';
import { Desktop, Mobile } from '../generic/MediaQuery';

class ContractSettings extends React.Component {

  constructor(props) {
    super(props);
    this.onToggleClick = this.onToggleClick.bind(this);
    this.state = {isEditing: false};
    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.onFieldEdit = this.onFieldEdit.bind(this);
    this.onCurrencySelected = this.onCurrencySelected.bind(this);
  }

  onCurrencySelected(e) {
    this.setState({currency: e.target.name});
  }

  onFieldEdit(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onEditButtonClick() {
    const isEditing = this.state.isEditing;
    if(isEditing) {
      const update = {
        fee: parseInt(this.state.fee, 10) || this.props.fee,
        minAmount: parseInt(this.state.amount, 10) || this.props.amount,
        minAmountCurrency: this.state.currency || this.props.currency,
        roi: parseInt(this.state.roi, 10) || this.props.roi,
        maxLoss: parseInt(this.state.maxLoss, 10) || this.props.maxLoss,
        duration: parseInt(this.state.duration, 10) || this.props.duration,
      };
      this.props.onSaveChangesClick(update);
      this.setState(this.getInitialState());
    } else {
      this.setState({...this.getInitialState(), isEditing: true});
    }
  }

  getInitialState() {
    return {
      isEditing: false,
      duration: '',
      amount: '',
      currency: this.props.currency,
      roi: '',
      maxLoss: '',
      fee: '',
    };
  }


  onToggleClick(e) {
    this.props.onSaveChangesClick({availableForOffers: !this.props.availableForOffers});
  }

  renderAcceptsRequests() {
    return (
      <Row className="row accept-requests">
        <Col xs="12" className="align-middle">
          <Row className="justify-content-between accept-block">
            <Col xs="auto" className="text">ACCEPT REQUESTS?</Col>
            <Col xs="auto" className="switch">
              <input className="cmn-toggle cmn-toggle-round-flat" type="checkbox" onChange={this.onToggleClick} checked={this.props.availableForOffers}/>
              <label onClick={this.onToggleClick} className="cmn-toggle-background"/>
              <label className="cmn-text cmn-yes-text">YES</label>
              <label className="cmn-text cmn-no-text">NO</label>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div className="row-fluid contract-setting-block">
        <div className="row title-setting">
          <div className="col-auto text-center align-middle contract-setting-title title-text">
            <span className="icon icon-settings icon-006-wrench"></span>Contract settings
          </div>
        </div>
        {this.renderAcceptsRequests()}
        {this.renderEntries()}
        <div className="row justify-content-center d-flex d-md-none tooltip-text-block">
          <div className="tooltip-mobile-box">
            <span className="pointer">*</span>To change your profile please accept or decline all offers in your dashboard
          </div>
        </div>
        {this.state.isEditing ? (
          <div className="col-12 d-flex align-items-center justify-content-between choose-btn-group">
            <button tabIndex={9} onClick={() => this.setState({isEditing: false})} type="button" className="edit-btn cancel-btn btn btn-secondary">CANCEL</button>
            <button tabIndex={10} onClick={this.onEditButtonClick} type="button" className="edit-btn send-request-btn btn btn-secondary active">
              SAVE CHANGES</button>
          </div>
        ) : (
          <div className="row justify-content-center">
            <button
              tabIndex={10}
              onClick={this.onEditButtonClick} type="button"
              className={classNames('edit-btn', 'btn', 'btn-secondary', {active: this.state.isEditing})}
              data-toggle="popover" data-trigger="hover"
              data-content="To change your profile please accept or decline all offers in your dashboard">
              EDIT
            </button>
          </div>
        )}
      </div>
    );
  }

  renderEntries() {
    return (
      <div  className="row justify-content-between settings">
        <Col xs="auto" lg="12" xl="12">
          <Setting
            className={'duration-block input-block'}
            tabIndex={1}
            header="DURATION OF CONTRACT"
            value={this.props.duration}
            dimension="DAYS"
            isEditing={this.state.isEditing}
            editValue={this.state.duration}
            name="duration"
            onChange={this.onFieldEdit}
          />
          <CurrencyOfContractButton 
            isEditing={this.state.isEditing}
            onCurrencySelected={this.onCurrencySelected}
            currency={this.state.currency}
          />
          <SettingAmount
            tabIndex={2}
            value={this.props.amount}
            dimension={this.props.currency}
            isEditing={this.state.isEditing}
            editValue={this.state.amount}
            editCurrency={this.state.currency}
            onChange={this.onFieldEdit}
            onCurrencySelected={this.onCurrencySelected}
          />       

          <div>
            <Desktop>
              <Setting
                tabIndex={3}
                header="ROI"
                value={this.props.roi}
                dimension="%"
                isEditing={this.state.isEditing}
                editValue={this.state.roi}
                name="roi"
                onChange={this.onFieldEdit}
              />  
            </Desktop>  
          </div>          
        </Col>
        <Col xs="auto" lg="12" xl="12">
          <div>
            <Mobile>
              <Setting
                tabIndex={3}
                header="ROI"
                value={this.props.roi}
                dimension="%"
                isEditing={this.state.isEditing}
                editValue={this.state.roi}
                name="roi"
                onChange={this.onFieldEdit}
              />  
            </Mobile>  
          </div>              
          <Setting
            tabIndex={4}
            header="MAX LOSS"
            value={this.props.maxLoss}
            dimension="%"
            isEditing={this.state.isEditing}
            editValue={this.state.maxLoss}
            name="maxLoss"
            onChange={this.onFieldEdit}
          />
          <Setting
            tabIndex={5}
            header="FEE"
            value={this.props.fee}
            dimension="%"
            isEditing={this.state.isEditing}
            editValue={this.state.fee}
            name="fee"
            onChange={this.onFieldEdit}
          />
        </Col>

      </div>
    );
  }

}

const SettingEntry = ({value, dimension}) => (
  <div className="value-text loss-text-block text-block">{value} <span className="days">{dimension}</span></div>
);

const Setting = ({className, header, value, dimension, isEditing, editValue, onChange, name, tabIndex}) => (
  <div className="setting-block">
    <div className="description-text">{header}:</div>
    {isEditing ? (
      <EditSettingsEntry
        className={className}
        tabIndex={tabIndex}
        dimension={dimension}
        onChange={onChange}
        name={name}
        placeholder={value}
        value={editValue}
      />
    ) : (
      <SettingEntry
        value={value}
        dimension={dimension}
      />
    )}
  </div>
);

const SettingAmount = ({isEditing, value, dimension, editValue, onChange, tabIndex}) => (
  <div className="loss-block setting-block">
    <div className="description-text">MIN CONTRACT AMOUNT:</div>
    {isEditing ? (
      <EditAmountEntry
        tabIndex={tabIndex}
        onChange={onChange}
        value={editValue}
        placeholder={value}
      />

    ) : (
      <SettingEntry
        value={value}
        dimension={dimension}
      />
    )}
  </div>
);

const EditAmountEntry = ({placeholder, value, onChange, tabIndex}) => (
  <div className="amount-input-block input-block">
    <div className="input-group">
      <input
        tabIndex={tabIndex}
        className="form-control"
        onChange={onChange}
        name="amount"
        value={value}
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  </div>
);

const CurrencyOfContractButton = ({isEditing, onCurrencySelected, currency}) => (
  <div className='currency-button-block setting-block'>
    {isEditing ? (
      <div className="input-block">
        <div className="description-text">CURRENCY OF CONTRACT:</div>
          <div className='input-group'>
              <span className="input-group-btn only-button">
                <button
                  onClick={onCurrencySelected}
                  name="BTC"
                  className={classNames('btn', 'btn-secondary', {active: currency === 'BTC'})}
                  type="button"
                >BTC</button>
                <button
                  onClick={onCurrencySelected}
                  name="USDT"
                  className={classNames('btn', 'btn-secondary', {active: currency === 'USDT'})}
                  type="button"
                >USDT</button>
                <button
                  onClick={onCurrencySelected}
                  name="ETH"
                  className={classNames('btn', 'btn-secondary', {active: currency === 'ETH'})}
                  type="button"
                >ETH</button>        
              </span>
            </div>
          </div>
      ) : (<div style={{display: 'none'}}></div>)
    }
  </div>
)

const EditSettingsEntry = ({className, placeholder,value, dimension, name, onChange, tabIndex}) => (
  <div className={className || 'loss-input-block  input-block'}>
    <div className="input-group">
      <input
        tabIndex={tabIndex}
        className="form-control"
        onChange={onChange}
        name={name}
        value={value}
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <span className="input-group-btn">
        <button className="btn btn-secondary" type="button">{dimension}</button>
      </span>
    </div>
  </div>
);



export default ContractSettings;
