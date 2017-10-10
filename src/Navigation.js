import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import Logo from './img/MainLogo.png';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class Navigation extends React.Component {
  render() {
    return (
      <div className="page_left_col">
        <div className="left_col_logo_wrapper">
          <NavLink className="left_col_logo_a" to="/">
            <img className="left_col_logo" src={Logo} alt="" />
          </NavLink>
        </div>
        <div className="left_col_menu_wrapper">
          <ul className="left_col_menu_ul">
            {this.renderLinks()}
            <li key="demo" className={'left_col_menu_li left_col_menu_li_5'}>
              <a className="left_col_menu_a" href="http://demo.mercatus.im">Demo</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  getLinks() {
    return [
      {name: 'Dashboard', to: '/dashboard'},
      {name: 'Profile', to: this.props.auth.profile ? '/' + this.props.auth.profile.name : '/profile'},
      {name: 'Ratings', to: '/ratings'},
      {name: 'Terminal', to: '/terminal'}
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
