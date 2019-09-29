import React from 'react';
import classNames from 'classnames';
import { Row, Col } from 'reactstrap';
import {connect} from 'react-redux';
import {FormattedMessage, injectIntl} from 'react-intl';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import  SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import { showInfoModal } from '../../actions/modal';
import LockButton from '../../components/LockButton';

class ContractSettings extends React.Component {

  constructor(props) {
    super(props);
    this.onToggleClick = this.onToggleClick.bind(this);
    this.state = {isEditing: false,} ;
    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.onFieldEdit = this.onFieldEdit.bind(this);
    this.onCurrencySelected = this.onCurrencySelected.bind(this);
  }


  onCurrencySelected(e) {
    this.setState({currency: e.target.name});
  }

  onFieldEdit(e, interval) {
    const newValue = e.target.value,
      fieldName = e.target.name,
      isNewValueInInterval = (newValue >= interval[0]) &&
          (interval.length === 2 ? newValue <= interval[1] : true);
    if (interval) {
      if (isNewValueInInterval || newValue === '') {
        this.setState({[fieldName]: newValue});
      }
    } else {
      this.setState({[fieldName]: newValue});
    }
  }

  onEditButtonClick() {
    const isEditing = this.state.isEditing;
    if(isEditing) {
      const fee = parseInt(this.state.fee, 10) || this.props.fee;
      let minAmount = parseFloat(this.state.amount);
      if(isNaN(minAmount)) {
        minAmount = this.props.amount;
      }
      const currency = this.state.currency || this.props.currency;
      const roi = parseInt(this.state.roi, 10) || this.props.roi;
      const maxLoss = parseInt(this.state.maxLoss, 10) || this.props.maxLoss;
      const duration = parseFloat(this.state.duration) || this.props.duration;
      if(fee >= 100 || fee <= 0 || minAmount < 0 || roi <= 0 ||
        duration <= 0 || maxLoss <= 0) {;
        this.props.showModalWindow('profile.enterSetting');
        return;
      } else {
        const update = { fee, minAmount, currency, roi, maxLoss, duration };
        this.props.onSaveChangesClick(update);
        this.setState(this.getInitialState());
      }
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
    const {
      minAmount, fee, maxLoss, duration, roi, billing,
    } = this.props;
    const { trustManagement: { total, used } } = billing;


    const isButtonLock = used >= total && total !== -1;

    if (isButtonLock) {
      return;
    }

    if(fee >= 100 || fee <= 0 || minAmount <= 0 || roi <= 0 ||
      duration <= 0 || maxLoss <= 0) {
      this.props.showModalWindow('profile.needEditFirst');
      return;
    }
    this.props.onToggleClick(!this.props.availableForOffers);
  }

  renderAcceptsRequests() {
    const { trustManagement } = this.props.billing;

    return (
      <Row className="row accept-requests">
        <Col xs="12" className="align-middle">
          <Row className="justify-content-between accept-block">
            <Col xs="auto" className="text">
              <FormattedMessage
                id="profile.acceptRequestQuestion"
                defaultMessage="ACCEPT REQUESTS?"
              />
            </Col>
            <LockButton offsetTop="-10px" {...trustManagement}>
              <Col xs="auto" className="switch" onClick={this.onToggleClick}>
                  <input className="cmn-toggle cmn-toggle-round-flat" type="checkbox"
                    onChange={this.onToggleClick}
                    checked={this.props.availableForOffers || false}/>
                <label className="cmn-toggle-background"/>
                <label className="cmn-text cmn-yes-text">
                  <FormattedMessage
                    id="yes"
                    defaultMessage="yes"
                  />
                </label>
                <label className="cmn-text cmn-no-text">
                  <FormattedMessage
                    id="no"
                    defaultMessage="no"
                  />
                </label>
              </Col>
            </LockButton>
          </Row>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div className="row-fluid contract-setting-block">
        <NotificationSettings billing={this.props.billing} />
        <div className="row title-setting">
          <div className="col-auto text-center align-middle contract-setting-title title-text">
            <span className="icon icon-settings icon-006-wrench"/>
            <FormattedMessage
              id="profile.contractSettings"
              defaultMessage="Contract settings"
            />
          </div>
        </div>
        {this.renderAcceptsRequests()}
        {this.renderEntries()}
        <div className="row justify-content-center d-flex d-md-none tooltip-text-block">
          <div className="tooltip-mobile-box">
            <span className="pointer">*</span>
            <FormattedMessage
              id="profile.toChangeYouProfileMessage"
              defaultMessage="To change your profile please accept or decline all offers in your dashboard"
            />
          </div>
        </div>
        {this.state.isEditing ? (
          <div className="col-12 d-flex align-items-center justify-content-between choose-btn-group">
            <button tabIndex={9} onClick={() => this.setState({isEditing: false})} type="button" className="edit-btn cancel-btn btn btn-secondary">
              <FormattedMessage
                id="profile.cancel"
                defaultMessage="CANCEL"
              />
            </button>
            <button tabIndex={10} onClick={this.onEditButtonClick} type="button" className="edit-btn send-request-btn btn btn-secondary active">
              <FormattedMessage
                id="profile.saveChanges"
                defaultMessage="SAVE CHANGES"
              />
            </button>
          </div>
        ) : (
          <div className="row justify-content-center">
            <button
              tabIndex={10}
              onClick={this.onEditButtonClick} type="button"
              className={classNames('edit-btn', 'btn', 'btn-secondary', {active: this.state.isEditing})}>
              <FormattedMessage
                id="profile.edit"
                defaultMessage="EDIT"
              />
            </button>
          </div>
        )}
        <SecuritySettings/>
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
            onChange={(e) => this.onFieldEdit(e,[1])}
          />
          <CurrencyOfContractButton
            value={this.props.currency}
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
            onChange={(e) => this.onFieldEdit(e,[0])}
            onCurrencySelected={this.onCurrencySelected}
          />

          <div>
            <Desktop>
              <Setting
                tabIndex={3}
                header={this.props.intl.messages['profile.targetProfit']}
                value={this.props.roi}
                dimension="%"
                isEditing={this.state.isEditing}
                editValue={this.state.roi}
                name="roi"
                onChange={(e) => this.onFieldEdit(e,[1])}
              />
            </Desktop>
          </div>
        </Col>
        <Col xs="auto" lg="12" xl="12">
          <div>
            <Mobile>
              <Setting
                tabIndex={3}
                header={this.props.intl.messages['profile.targetProfit']}
                value={this.props.roi}
                dimension="%"
                isEditing={this.state.isEditing}
                editValue={this.state.roi}
                name="roi"
                onChange={(e) => this.onFieldEdit(e,[1])}
              />
            </Mobile>
          </div>
          <Setting
            tabIndex={4}
            header={this.props.intl.messages['profile.maxLoss']}
            value={this.props.maxLoss}
            dimension="%"
            isEditing={this.state.isEditing}
            editValue={this.state.maxLoss}
            name="maxLoss"
            onChange={(e) => this.onFieldEdit(e,[0,99])}
          />
          <Setting
            tabIndex={5}
            header={this.props.intl.messages['profile.fee']}
            value={this.props.fee}
            dimension="%"
            isEditing={this.state.isEditing}
            editValue={this.state.fee}
            name="fee"
            onChange={(e) => this.onFieldEdit(e,[0,99])}
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

const SettingAmount = ({isEditing, value, dimension, editValue, onChange, tabIndex, editCurrency}) => (
  <div className="loss-block setting-block">
    <div className="description-text">MIN CONTRACT AMOUNT:</div>
    {isEditing ? (
      <EditAmountEntry
        dimension={editCurrency}
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

export const EditAmountEntry = ({placeholder, value, onChange, tabIndex, dimension}) => (
  <div className="amount-input-block input-block membrana-input-block">
    <div className="input-group">
      <input
        tabIndex={tabIndex}
        className="form-control"
        onChange={onChange}
        name="amount"
        value={value}
        type="number"
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <span className="input-group-btn">
        <button className="btn btn-secondary" type="button">{dimension}</button>
      </span>
    </div>
  </div>
);

const CurrencyOfContractButton = ({isEditing, onCurrencySelected, currency, value}) => (
  <div className='currency-button-block setting-block'>
    <div className="input-block">
      <div className="description-text">
        <FormattedMessage
          id="profile.currencyOfContract"
          defaultMessage="CURRENCY OF CONTRACT:"
        />
      </div>
      {isEditing ? (

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

      ) : (
        <SettingEntry
          value={value}
        />)
      }
    </div>
  </div>
);

const EditSettingsEntry = ({className, placeholder,value, dimension, name, onChange, tabIndex}) => (
  <div className={className || 'loss-input-block  input-block'}>
    <div className="input-group">
      <input
        tabIndex={tabIndex}
        className="form-control"
        onChange={onChange}
        name={name}
        value={value}
        type="number"
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <span className="input-group-btn">
        <button className="btn btn-secondary" type="button">{dimension}</button>
      </span>
    </div>
  </div>
);

const mapDispatchToProps = dispatch => ({
  showModalWindow: text => dispatch(showInfoModal(text)),
});

export default injectIntl(connect(state => state, mapDispatchToProps)(ContractSettings));

