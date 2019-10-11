import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'reactstrap';
import {disableTwoFactorAuthModal, enableTwoFactorAuthModal} from '../../actions/modal';
import {connect} from 'react-redux';

class SecuritySettings extends React.Component {
  state = {
    is2FAEnable: this.props.profile.mfaEnabled || false,
  }

  static getDerivedStateFromProps(props, state) {
    if (state.is2FAEnable !== props.profile.mfaEnabled) {
      return {is2FAEnable: props.profile.mfaEnabled};
    }
    return null;
  }

  on2FASwitcherToggle = (e) => {
    const { is2FAEnable } = this.state;
    const { disable2FA, enable2FA } = this.props;
    e.preventDefault();
    is2FAEnable ? disable2FA() : enable2FA();
  }

  render2FASwitcher = () => {
    const {is2FAEnable = false} = this.state;
    return (
      <Row className="row accept-requests">
        <Col xs="12" className="align-middle">
          <Row className="justify-content-between accept-block">
            <Col xs="auto" className="text">
              <FormattedMessage
                id="profile.enable2FA"
                defaultMessage="Enable 2FA"
              />
            </Col>
            <Col xs="auto" className="switch" onClick={this.on2FASwitcherToggle}>
              <input className="cmn-toggle cmn-toggle-round-flat" type="checkbox"
                onChange={this.on2FASwitcherToggle}
                checked={is2FAEnable}/>
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
          </Row>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="row title-setting">
          <div className="col-auto text-center align-middle contract-setting-title title-text">
            <span className="icon icon-settings icon-006-wrench"/>
            <FormattedMessage
              id="profile.securitySettings"
              defaultMessage="Security settings"
            />
          </div>
        </div>
        {this.render2FASwitcher()}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  enable2FA: enableTwoFactorAuthModal,
  disable2FA: disableTwoFactorAuthModal,
};


export default connect(state => state, mapDispatchToProps)(SecuritySettings);
