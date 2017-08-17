import { BrowserRouter, NavLink, Route, Redirect } from 'react-router-dom';
import logo from './Logo.svg';
import React from 'react';
import Dashboard from './dashboard/DashboardContainer';
import Login from './login/Login';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const MainRouter = () => (
  <BrowserRouter>
    <div>
      <nav>
        <NavLink to="/">
          <img src={logo} className="App-logo" alt="logo" />
        </NavLink>
        <a href="/">
        </a>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/profile/some">Profile</NavLink>
        <NavLink to="/ratings">Ratings</NavLink>
        <NavLink to="/terminal">Terminal</NavLink>
      </nav>
      <Route exact path='/login' component={Login} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
    </div>
  </BrowserRouter>
);



let ProtectedRoute = ({ path, component: Component, loggedIn }) => {
  const render = (props) => {
    if(loggedIn) {
      return (<Component />);
    } else {
      return (<Redirect to="login" />);
    }
  };

  return (<Route path={path} render={render} />);
};

ProtectedRoute = withRouter(connect(state => {
  return {loggedIn: state.auth.loggedIn};
})(ProtectedRoute));


export default MainRouter;
