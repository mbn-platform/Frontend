import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { updateNotificationSettings, verifyTelegram, updateInfo } from '../../actions/profile';
import LockButton from '../../components/LockButton';

class NotificationSettings extends React.Component {

  static propTypes = {
    contacts: PropTypes.array.isRequired,
    settings: PropTypes.object.isRequired,
    info: PropTypes.string,
  }

  static defaultProps = {
    settings: {
      analyzer: false,
      orders: false,
      info: false,
    },
    contacts: [],
  }

  onChange = (title, value) => {
    const settings = {
      ...this.props.settings,
      [title]: value,
    };
    this.props.updateNotificationSettings(settings);
  }

  render() {
    const { settings, info, billing } = this.props;
    const telegramContact = this.props.contacts.find((c) => c.type === 'telegram');
    return (
      <React.Fragment>
        <SettingsHeader title="profile.about" />
        <About info={info} updateInfo={this.props.updateInfo} />
        <SettingsHeader title="profile.notificationSettings"/>
        <TelegramContact contact={telegramContact} onVerifyClick={this.props.verifyTelegram} />
        <SettingsSwitch
          onToggle={this.onChange}
          title="orders"
          billing={billing}
          checked={settings.orders} />
        <SettingsSwitch
          onToggle={this.onChange}
          title="info"
          billing={billing}
          checked={settings.info} />
      </React.Fragment>
    );
  }
}



class SettingsHeader extends React.PureComponent {
  render() {
    const { title } = this.props;
    return (
      <div className="row title-setting">
        <div className="col-auto text-center align-middle contract-setting-title title-text">
          <span className="icon icon-settings icon-006-wrench"/>
          <FormattedMessage id={title} />
        </div>
      </div>
    );
  }
}

class About extends React.Component {

  state = {
    about: this.props.info || '',
  }

  onChange = (e) => {
    const about = e.target.value;
    if (about.length > 144) {
      return;
    }
    this.setState({about});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.info !== this.props.info) {
      this.setState({about: (this.props.info || '')});
    }
  }

  onSaveClick = () => {
    const info = this.state.about;
    if (info) {
      this.props.updateInfo(info);
    }
  }

  render() {
    const {about} = this.state;
    const canSave = about && about !== this.props.info;
    return (
      <Row>
        <textarea value={about} onChange={this.onChange}
          className='about'
          placeholder='Enter information about yourself' />
        {
          canSave ? (
            <Col  xs="12">
              <Row className="justify-content-center">
                <button className="edit-btn btn btn-secondary" style={{marginBottom: '15px'}} onClick={this.onSaveClick}>Save</button>
              </Row>
            </Col>
          ) : null
        }
      </Row>
    );
  }
}

function SettingsInput(props) {
  return <input className="profile-settings" {...props} />;
}

class TelegramContact extends React.Component {

  state = {
    telegram: '',
    isVerified: false,
  }

  static getDerivedStateFromProps(props, state) {
    let telegram;
    if (props.contact && props.contact.value) {
      telegram = '@' + props.contact.value;
    } else {
      telegram = '';
    }
    return {
      telegram: telegram,
      isVerified: (props.contact && props.contact.isVerified) || false,
    };
  }
  onChange = (e) => {
    const telegram = e.target.value;
    this.setState({telegram: telegram});
  }

  onVerifyClick = () => {
    this.props.onVerifyClick(this.state.telegram);
  }

  render() {
    let canVerify = false;
    if (!this.state.telegram) {
      canVerify = false;
    } else {
      if (this.props.contact && this.props.contact.isVerified
        && ('@' + this.props.contact.value) === this.state.telegram) {
        canVerify = false;
      } else {
        canVerify = true;
      }
    }
    return (
      <Row className='input-telegram'>
        <div className="description-text telegram" style={{
          margin: '5px 0 5px 0',
          color: '#bfbfc1',
          letterSpacing: '1px',
          fontSize: '11px'
        }} >YOUR TELEGRAM ID</div>
        <SettingsInput spellCheck={false} value={this.state.telegram} placeholder="@membrana" onChange={this.onChange} />
        {!canVerify ? null :(
          <Col  xs="12">
            <Row className="justify-content-center">
              <button className="edit-btn btn btn-secondary" style={{marginBottom: '15px'}} onClick={this.onVerifyClick}>Verify</button>
            </Row>
          </Col>
        )}
      </Row>
    );
  }
}

class SettingsSwitch extends React.PureComponent {

  onToggle = (e) => {
    this.props.onToggle(this.props.title, !this.props.checked);
  }

  render() {
    const { trustManagement } = this.props.billing; // TODO: add notification billing

    return (
      <Row className="row accept-requests">
        <Col xs="12" className="align-middle">
          <Row className="justify-content-between accept-block">
            <Col xs="auto" className="text">
              <FormattedMessage
                id={this.props.title}
                defaultMessage={this.props.title} />
            </Col>
            <LockButton offsetTop="-10px" {...trustManagement}>
              <Col xs="auto" className="switch" onClick={this.onToggle}>
                <input className="cmn-toggle cmn-toggle-round-flat" type="checkbox"
                  checked={this.props.checked}/>
                <label className="cmn-toggle-background"/>
                <label className="cmn-text cmn-yes-text">
                  <FormattedMessage
                    id="yes"
                    defaultMessage="yes" />
                </label>
                <label className="cmn-text cmn-no-text">
                  <FormattedMessage
                    id="no"
                    defaultMessage="no" />
                </label>
              </Col>
            </LockButton>
          </Row>
        </Col>
      </Row>
    );
  }

}

SettingsSwitch.propTypes = {
  title: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const mapPropsToState = (state) => ({
  contacts: state.profile.contacts,
  settings: state.profile.notificationSettings,
  info: state.profile.info,
});

const mapDispatchToProps = (dispatch) => ({
  updateNotificationSettings: (settings) => dispatch(updateNotificationSettings(settings)),
  verifyTelegram: (value) => dispatch(verifyTelegram(value)),
  updateInfo: (info) => dispatch(updateInfo(info)),
});

export default connect(mapPropsToState, mapDispatchToProps)(NotificationSettings);
