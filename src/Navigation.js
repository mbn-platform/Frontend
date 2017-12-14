import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './img/MainLogo.svg';
import LogoMobile from './img/HeaderLogoBigMobile.svg';
import DashboardIcon from './img/MenuIconDashboard.svg';
import DashboardIconHover from './img/MenuIconDashboardHover.svg';
import ProfileIcon from './img/MenuIconProfile.png';
import ProfileIconHover from './img/MenuIconProfile.png';
import TermianlIcon from './img/terminal.svg';
import TermianlIconHover from './img/terminal_hover.svg';
import OrdersIcon from './img/orders.svg';
import OrdersIconHover from './img/orders_hover.svg';
import HistoryIcon from './img/history.svg';
import HistoryIconHover from './img/history_hover.svg';
import RaitingIcon from './img/MenuIconRatings.svg';
import RaitingIconHover from './img/MenuIconRatingsHover.svg';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Navbar, NavbarToggler, NavbarBrand, Nav, Collapse, Col } from 'reactstrap';
import { Desktop, Mobile } from './generic/MediaQuery';
import { Container, Row } from 'reactstrap';
import classNames from 'classnames';

class Navigation extends React.Component {


  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {isOpen: false};
  }

  toggle() {
    this.setState({isOpen: !this.state.isOpen});
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
  render() {
    return (
      <Col xs="12" md="auto" className="d-block d-md-block menu-panel ">
        <Navbar expand="md"  >
          <NavbarBrand className="d-inline-block d-md-none" tag="div">
            <img src={LogoMobile} alt=""/>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} className={this.state.isOpen ? '' : 'collapsed'} />
          <Desktop>
            <Collapse isOpen={this.state.isOpen} className="ml-auto ml-md-0" navbar>
              <Nav pills className="flex-column w-100 align-middle" tag="div">
                {this.getLogo()}
                {this.getLinks().map(this.getBar)}
              </Nav>
            </Collapse>
          </Desktop>
          <Mobile>
            <Collapse isOpen={this.state.isOpen} className="ml-auto ml-md-0" navbar onClick={this.toggle}>
              <Nav pills className="flex-column w-100 align-middle" tag="div">
                {this.getLogo()}
                {this.getLinks().map(this.getBar)}
              </Nav>
            </Collapse>          
          </Mobile>
        </Navbar>
      </Col>
    );
  }

  getBar({name, to, imgClass,icon, iconHover}) {
    return (
      <NavLink to={to} key={name} className="nav-link">
        <Container className="h-100" fluid >
          <Row className="h-100">
            <Col xs="12" className="align-self-center">           
              <Container fluid className="align-middle">
                <Row>
                  <Col xs="3" md="12" className="d-flex justify-content-end justify-content-md-center">
                    <img class='image_menu image' src={icon} alt=""/>
                    <img class='image_menu_hover image' src={iconHover} alt=""/>
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
      <NavLink exact to="/" key="root" className="nav-link d-none d-md-flex no-hover-link">
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
      </NavLink>
    );
  }

  getLinks() {
    return [
      {
        name: 'Dashboard', 
        to: '/dashboard', 
        imgClass: 'dashboard',
        icon: DashboardIcon,
        iconHover: DashboardIconHover
      },
      {
        name: 'Profile', 
        to: this.props.auth.profile ? '/' + this.props.auth.profile.name : '/profile', 
        imgClass: 'profile',
        icon: ProfileIcon,
        iconHover: ProfileIconHover
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
      {
        name: 'History', 
        to: '/history', 
        imgClass: 'history',
        icon: HistoryIcon,
        iconHover: HistoryIconHover
      },
      {
        name: 'Ratings', 
        to: '/ratings', 
        imgClass: 'ratings',
        icon: RaitingIcon,
        iconHover: RaitingIconHover
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

const connected = withRouter(connect(state => ({auth: state.auth}))(Navigation));

export default connected;
