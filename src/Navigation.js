import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './assets/svg/MainLogo.svg';
import LogoMobile from './assets/svg/HeaderLogoBigMobile.svg';
import DashboardIcon from './assets/svg/MenuIconDashboard.svg';
import DashboardIconHover from './assets/svg/MenuIconDashboardHover.svg';
import ProfileIcon from './assets/svg/profile.svg';
import ProfileIconHover from './assets/svg/profile_hover.svg';
import TermianlIcon from './assets/svg/terminal.svg';
import TermianlIconHover from './assets/svg/terminal_hover.svg';
import OrdersIcon from './assets/svg/orders.svg';
import OrdersIconHover from './assets/svg/orders_hover.svg';
import RaitingIcon from './assets/svg/MenuIconRatings.svg';
import RaitingIconHover from './assets/svg/MenuIconRatingsHover.svg';
import LeaderboardIcon from './assets/svg/MenuIconLeaderboard.svg';
import LeaderboardIconHover from './assets/svg/MenuIconLeaderboardHover.svg';
import SignOut from './assets/svg/SignOut.svg';
import SignOutHover from './assets/svg/SignOutHover.svg';
import { connect } from 'react-redux';
import {APP_NAME, APP_HOST} from './constants';
import { withRouter } from 'react-router';
import { Navbar, NavbarToggler, NavbarBrand, Nav, Collapse, Col } from 'reactstrap';
import { Desktop, Mobile } from './generic/MediaQuery';
import ModalWindow from './components/Modal';
import TwoFactorAuthModal from './components/TwoFactorAuthModal';
import { Container, Row } from 'reactstrap';
import {injectIntl, FormattedMessage} from 'react-intl';
import {closeCodeModal, closeConfirmModal, closeInfoModal} from './actions/modal';
import { loggedOut } from './actions/auth';


class Navigation extends React.Component {


  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {isOpen: false};
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen});
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.auth.loggedIn && !nextProps.auth.loggedIn) {
      nextProps.history.push('/login');
    }
  }

  brand() {
    return (
      <div className="left_col_logo_wrapper">
        <NavLink className="left_col_logo_a" to="/">
          <img className="left_col_logo" src={Logo} alt="" />
        </NavLink>
      </div>
    );
  }

  renderGlobalConfirmModel = () => {
    const { modal, closeConfirmModalWindow,  } = this.props;
    return (
      <ModalWindow
        modalIsOpen={modal.isConfirmModalOpen}
        onClose={closeConfirmModalWindow}
        title={
          <FormattedMessage
            id={modal.modalComponent || 'message'}
            defaultMessage="Message"
            values={modal.modalProps}
          />
        }
        content={
          <div>
            <button className="modal__button btn" onClick={() => {
              modal.confirmCallback();
              closeConfirmModalWindow();
            }}>
              {this.props.intl.messages['yes']}
            </button>
            <button className="modal__button btn" onClick={closeConfirmModalWindow}>
              {this.props.intl.messages['no']}
            </button>
          </div>
        }
      />
    );
  }

  renderGlobalInformModel = () => {
    const { modal, closeInfoModalWindow } = this.props;
    return (
      <ModalWindow
        modalIsOpen={modal.isInfoModalOpen}
        onClose={closeInfoModalWindow}
        title={
          <FormattedMessage
            id={modal.modalComponent || 'message'}
            defaultMessage="Message"
            values={modal.modalProps}
          />
        }
        content={
          <div>
            <button className="modal__button btn" onClick={closeInfoModalWindow}>
              {this.props.intl.messages['ok']}
            </button>
          </div>
        }
      />
    );
  }

  renderCodeInformModel = () => {
    const { modal, closeCodeModalWindow } = this.props;
    return (
      <ModalWindow
        modalIsOpen={modal.isCodeInfoModalOpen}
        onClose={closeCodeModalWindow}
        title={
          <FormattedMessage
            id={modal.modalTitle || 'message'}
            defaultMessage="Message"
          />
        }
        content={
          <div>
            <div className="modal__content-wrapper">
              <div className="modal__key-annotation">
                <FormattedMessage
                  id={modal.modalText || 'message'}
                  defaultMessage="Message"
                />
              </div>
              <div className="modal__key-wrapper">
                <div className="modal__key-item">
                  <FormattedMessage
                    id="keyIs"
                    defaultMessage="Key: {key}"
                    values={{key: modal.modalKey}}
                  />
                </div>
                <div className="modal__key-item">
                  <FormattedMessage
                    id="secretIs"
                    defaultMessage="Secret: {secret}"
                    values={{secret: modal.modalCode}}
                  />
                </div>

              </div>
              <button className="modal__button btn" onClick={closeCodeModalWindow}>
                {this.props.intl.messages['ok']}
              </button>
            </div>
          </div>
        }
      />
    );
  }


  renderTwoFactorAuthModal = () => <TwoFactorAuthModal appName={APP_NAME} appHost={APP_HOST}/>


  render() {
    return (
      <Col xs="12" md="auto" className="d-block menu-panel">
        <Navbar expand="md"  >
          <NavbarBrand className="d-inline-block d-md-none" tag="div">
            <a target="_blank" rel='noopener noreferrer' href="https://membrana.io">
              <img src={LogoMobile} alt=""/>
            </a>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} className={this.state.isOpen ? '' : 'collapsed'} />
          <Desktop>
            <Collapse isOpen={this.state.isOpen} className="ml-auto ml-md-0" navbar>
              <Nav pills className="flex-column w-100 align-middle" tag="div">
                {this.getLogo()}
                {this.getLinks().map(this.getBar)}
                {this.signOutButton()}
              </Nav>
            </Collapse>
          </Desktop>
          <Mobile>
            <Collapse isOpen={this.state.isOpen} className="ml-auto ml-md-0" navbar onClick={this.toggle}>
              <Nav pills className="flex-column w-100 align-middle" tag="div">
                {this.getLogo()}
                {this.getLinks().map(this.getBar)}
                {this.signOutButton()}
              </Nav>
            </Collapse>
          </Mobile>
        </Navbar>
        {this.renderCodeInformModel()}
        {this.renderGlobalInformModel()}
        {this.renderGlobalConfirmModel()}
        {this.renderTwoFactorAuthModal()}
      </Col>
    );
  }

  signOutButton() {
    if(!this.props.auth.loggedIn && !this.props.auth.nameRequired) {
      return null;
    }
    const onClick = e => {
      e.preventDefault();
      this.props.logOut();
    };
    return (
      <a onClick={onClick} href="/" className="nav-link">
        <Container className="h-100" fluid >
          <Row className="h-100">
            <Col xs="12" className="align-self-center">
              <Container fluid className="align-middle">
                <Row>
                  <Col xs="3" md="12" className="d-flex justify-content-end justify-content-md-center">
                    <img className='image_menu image' src={SignOut} alt=""/>
                    <img className='image_menu_hover image' src={SignOutHover} alt=""/>
                  </Col>
                  <Col xs="auto" className="d-flex d-md-none">
                    <div className="gap"/>
                  </Col>
                  <Col xs="3" md="12" className="d-flex justify-content-start justify-content-md-center">
                    <div className="menu-text">Sign out</div>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </a>
    );
  }

  getBar({name, to, imgClass, icon, iconHover}) {
    return (
      <NavLink to={to} key={name} className="nav-link">
        <Container className="h-100" fluid >
          <Row className="h-100">
            <Col xs="12" className="align-self-center">
              <Container fluid className="align-middle">
                <Row>
                  <Col xs="3" md="12" className="d-flex justify-content-end justify-content-md-center">
                    <img className='image_menu image' src={icon} alt=""/>
                    <img className='image_menu_hover image' src={iconHover} alt=""/>
                  </Col>
                  <Col xs="auto" className="d-flex d-md-none">
                    <div className="gap"/>
                  </Col>
                  <Col xs="3" md="12" className="d-flex justify-content-start justify-content-md-center">
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

  getLogo() {
    return (
      <a target="_blank" href="https://membrana.io" rel='noopener noreferrer' className="nav-link d-none d-md-flex">
        <Container fluid className="h-100">
          <Row className="h-100">
            <Col xs="12" className="align-self-center">
              <Container fluid className="align-middle">
                <Row className="d-flex justify-content-center">
                  <img className="cursor-pointer" src={Logo} width="36" height="36" alt="" />
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </a>
    );
  }

  getLinks() {
    return [
      {
        name: 'Profile',
        to: this.props.auth.loggedIn ? '/' + this.props.auth.profile.name : '/profile',
        imgClass: 'profile',
        icon: ProfileIcon,
        iconHover: ProfileIconHover
      },
      {
        name: 'Dashboard',
        to: '/dashboard',
        imgClass: 'dashboard',
        icon: DashboardIcon,
        iconHover: DashboardIconHover
      },
      {
        name: 'Leaderboard',
        to: '/leaderboard',
        imgClass: 'leaderboard',
        icon: LeaderboardIcon,
        iconHover: LeaderboardIconHover
      },
      {
        name: 'Ratings',
        to: '/rating',
        imgClass: 'ratings',
        icon: RaitingIcon,
        iconHover: RaitingIconHover
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
      },
    ];
  }

  renderLinks() {
    return this.getLinks().map((link, index) => (
      <li key={link.name} className={`left_col_menu_li left_col_menu_li_${index + 1}`}>
        <NavLink className="left_col_menu_a" to={link.to} exact>{link.name}</NavLink>
      </li>
    ));
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeInfoModalWindow: () => dispatch(closeInfoModal),
    closeConfirmModalWindow: () => dispatch(closeConfirmModal),
    closeCodeModalWindow: () => dispatch(closeCodeModal),
    logOut: () => dispatch(loggedOut()),
  };
};

const connected = withRouter(connect(state => ({auth: state.auth, modal: state.modal}), mapDispatchToProps)(Navigation));

export default injectIntl(connected);
