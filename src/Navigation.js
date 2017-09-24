import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import Logo from './img/MainLogo.png';
const pages = [
  {name: 'Dashboard', to: '/dashboard'},
  {name: 'Profile', to: '/profile'},
  {name: 'Ratings', to: '/ratings'},
  {name: 'Terminal', to: '/terminal'}
];


const Navigation = () => (
  <div className="page_left_col">
    <div className="left_col_logo_wrapper">
      <NavLink className="left_col_logo_a" to="/">
        <img className="left_col_logo" src={Logo} alt="" />
      </NavLink>
    </div>
    <div className="left_col_menu_wrapper">
      <ul className="left_col_menu_ul">
        {renderLinks()}
      </ul>
    </div>
  </div>
);

const renderLinks = () => (
  pages.map((link, index) => (
    <li key={link.name} className={`left_col_menu_li left_col_menu_li_${index + 1}`}>
      <NavLink className="left_col_menu_a" to={link.to}>{link.name}</NavLink>
    </li>
    ))
);

export default Navigation;
