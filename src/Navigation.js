import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoMobile from './assets/svg/HeaderLogoBigMobile.svg';
import DashboardIcon from './assets/svg/MenuIconDashboard.svg';
import DashboardIconHover from './assets/svg/MenuIconDashboardHover.svg';
import ProfileIcon from './assets/svg/profile.svg';
import ProfileIconHover from './assets/svg/profile_hover.svg';
import TermianlIcon from './assets/svg/terminal.svg';
import TermianlIconHover from './assets/svg/terminal_hover.svg';
import OrdersIcon from './assets/svg/orders.svg';
import OrdersIconHover from './assets/svg/orders_hover.svg';
import LeaderboardIcon from './assets/svg/MenuIconLeaderboard.svg';
import LeaderboardIconHover from './assets/svg/MenuIconLeaderboardHover.svg';
import HelpIcon from './assets/svg/MenuIconHelp.svg';
import HashlogIcon from './assets/svg/MenuIconHashlog.svg';
import HashlogIconHover from './assets/svg/MenuIconHashlogHover.svg';
import StakingIcon from './assets/svg/MenuIconStaking.svg';
import StakingIconHover from './assets/svg/MenuIconStakingHover.svg';
import TariffsIcon from './assets/svg/tariffs.svg';
import TariffsIconHover from './assets/svg/tariffsHover.svg';
import { connect } from 'react-redux';
import {APP_NAME, APP_HOST} from './constants';
import { withRouter } from 'react-router';
import { Navbar, NavbarToggler, NavbarBrand, Nav, Collapse, Col } from 'reactstrap';
import { Desktop, Mobile } from './generic/MediaQuery';
import { Container, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import {
  closeCodeModal,
  closeConfirmModal,
  closeInfoModal,
  closeUpgradeTariffModal,
  closeCreateGroupModal,
  closeAddContractToGroupModal,
  closeTelegramVerifyCodeModal,
} from './actions/modal';
import { loggedOut } from './actions/auth';
import {ESCAPE_KEYCODE} from './constants';
import { SignOutButton } from './components/navigation/SignOutButton';
import { PlatformLogo } from './components/navigation/PlatformLogo';
import { redirectToAuthorization } from './actions/auth';

import { GlobalInformModal, GlobalConfirmModal, CodeInformModal,
  UpgradeTariffModal, TwoFactorAuthModal, CommitTokensModal,
  VerifyTelegramModal, AddContractModal, CreateGroupModal,
} from './components/modal';

class Navigation extends React.Component {

  state = {
    isOpen: false,
    isExpanded: false,
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.auth.loggedIn && !this.props.auth.loggedIn) {
      redirectToAuthorization();
    }
  }

  toggle = () => {
    const isOpen = !this.state.isOpen;
    this.setState({ isOpen });
    if (isOpen) {
      window.addEventListener('keydown', this.handleKeydown);
    }
  }

  handleKeydown = (event) => {
    if (this.state.isOpen && event.keyCode === ESCAPE_KEYCODE) {
      this.setState({isOpen: false});
      window.removeEventListener('keydown', this.handleKeydown);
    }
  }

  renderCommitTokensModal = () => {
    const { modal } = this.props;

    return modal.isCommitTokensModalOpen ? (
      <CommitTokensModal
        modal={modal}
      />
    ) : null;
  }

  renderCreateGroupModal = () => {
    const { modal, closeCreateGroupModalWindow } = this.props;

    return modal.isCreateGroupModalOpen ? (
      <CreateGroupModal
        modal={modal}
        intl={this.props.intl}
        closeCreateGroupModal={closeCreateGroupModalWindow}
      />
    ) : null;
  }

  renderAddContractModal = () => {
    const { modal, closeAddContractToGroupModalWindow } = this.props;

    return modal.isAddContractModalOpen ? (
      <AddContractModal
        intl={this.props.intl}
        modal={modal}
        closeAddContractToGroupModal={closeAddContractToGroupModalWindow}
      />
    ) : null;
  }

  render() {
    const { isExpanded } = this.state;
    return (
      <Col xs="12"
        md="auto"
        className={`
          d-block
          menu-panel
          navigation__tab-container
          ${!isExpanded && 'navigation__tab-container_hidden'}`
        }>
        <Navbar expand="md"  >
          <NavbarBrand className="d-inline-block d-md-none" tag="div">
            <a target="_blank" rel='noopener noreferrer' href={`https://${APP_HOST}`}>
              <img src={LogoMobile} height="23px" alt=""/>
            </a>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} className={this.state.isOpen ? '' : 'collapsed'} />
          <Desktop>
            <Collapse isOpen={this.state.isOpen} className="ml-auto ml-md-0 navigation__tab-wrapper" navbar>
              <Nav pills className="flex-column w-100 align-middle" tag="div">
                <PlatformLogo />
                {this.getLinks().map(this.getBar)}
                <SignOutButton logOut={this.props.logOut} {...this.props.auth} />
              </Nav>
            </Collapse>
          </Desktop>
          <Mobile>
            <Collapse isOpen={this.state.isOpen} className="ml-auto ml-md-0" navbar onClick={this.toggle}>
              <Nav pills className="flex-column w-100 align-middle" tag="div">
                <PlatformLogo />
                {this.getLinks().map(this.getBar)}
                <SignOutButton logOut={this.props.logOut} {...this.props.auth} />
              </Nav>
            </Collapse>
          </Mobile>
        </Navbar>
        <CodeInformModal {...this.props} />
        <GlobalInformModal {...this.props} />
        <GlobalConfirmModal {...this.props} />
        <UpgradeTariffModal {...this.props} />
        <TwoFactorAuthModal appName={APP_NAME} appHost={APP_HOST} intl={this.props.intl}/>
        {this.renderCommitTokensModal()}
        {this.renderCreateGroupModal()}
        {this.renderAddContractModal()}
        <VerifyTelegramModal {...this.props} />
        <div
          className="navigation__splitter"
          onClick={() => this.setState({isExpanded: !isExpanded})}>
          <div className="navigation__splitter-arrow"/>
        </div>
      </Col>
    );
  }

  getBar = ({name, to, imgClass, icon, iconHover}) => {
    const {isExpanded} = this.state;
    return (
      <NavLink to={to} key={name} title={name} className="nav-link">
        <Container className="h-100" fluid >
          <Row className="h-100">
            <Col xs="12" md={isExpanded ? 12 : 4} className="align-self-center navigation__tab-item">
              <Container fluid className="align-middle">
                <Row>
                  <Col xs="3" md="12" className="d-flex justify-content-end justify-content-md-center">
                    <img className='image_menu image' src={icon} alt=""/>
                    <img className='image_menu_hover image' src={iconHover} alt=""/>
                  </Col>
                  <Col xs="auto" className="d-flex d-md-none">
                    <div className="gap"/>
                  </Col>
                  <Col xs="3" md="12" className={'d-flex justify-content-start justify-content-md-center'}>
                    <div className="menu-text">{name}</div>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </NavLink>
    );
  }

  getLinks() {
    return [
      {
        name: 'FAQ',
        to: '/howitworks',
        imgClass: 'staking',
        icon: HelpIcon,
        iconHover: HelpIcon,
      },
      {
        name: 'Profile',
        to: this.props.auth.loggedIn ? '/' + this.props.auth.profile.name : '/profile',
        imgClass: 'profile',
        icon: ProfileIcon,
        iconHover: ProfileIconHover
      },
      {
        name: 'Service Plans',
        to: '/tariffs',
        imgClass: 'tariffs',
        icon: TariffsIcon,
        iconHover: TariffsIconHover,
      },
      {
        name: 'Dashboard',
        to: '/dashboard',
        imgClass: 'dashboard',
        icon: DashboardIcon,
        iconHover: DashboardIconHover
      },
      {
        name: 'Rating',
        to: '/rating',
        imgClass: 'leaderboard',
        icon: LeaderboardIcon,
        iconHover: LeaderboardIconHover
      },
      {
        name: 'Terminal',
        to: '/terminal',
        imgClass: 'terminal',
        icon: TermianlIcon,
        iconHover: TermianlIconHover
      },
      {
        name: 'Orders',
        to: '/orders',
        imgClass: 'orders',
        icon: OrdersIcon,
        iconHover: OrdersIconHover
      }, {
        name: 'Hashlog',
        to: '/hashlog',
        imgClass: 'hashlog',
        icon: HashlogIcon,
        iconHover: HashlogIconHover,
      }, {
        name: 'Staking',
        to: '/staking',
        imgClass: 'staking',
        icon: StakingIcon,
        iconHover: StakingIconHover,
      },
    ];
  }

}

const mapStateToProps = ({ auth, modal, terminal }) => ({
  auth,
  modal,
  terminal,
});

const mapDispatchToProps = {
  closeInfoModalWindow: closeInfoModal,
  closeConfirmModalWindow: closeConfirmModal,
  closeCodeModalWindow: closeCodeModal,
  closeUpgradeTariffModalWindow: closeUpgradeTariffModal,
  closeCreateGroupModalWindow: closeCreateGroupModal,
  closeAddContractToGroupModalWindow: closeAddContractToGroupModal,
  closeTelegramVerifyCodeModal,
  logOut: loggedOut,
};

const connected = withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));

export default injectIntl(connected);
