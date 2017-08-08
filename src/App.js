import React, { Component } from 'react';
import logo from './Logo.svg';
import { BrowserRouter, NavLink, Route, Redirect, Switch } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';


const Root = () => (
  <div>Site is under heavy construction</div>
);
const App = () => (
  <BrowserRouter>
    <div>
      <nav>
        <NavLink to="/">
          <img src={logo} className="App-logo" alt="logo" />
        </NavLink>
        <a href="/">
        </a>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/ratings">Ratings</NavLink>
        <NavLink to="/terminal">Terminal</NavLink>
      </nav>
      <div className="MainContent">
        <Switch>
          <Route exact path="/" component={Root}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/ratings" component={Ratings}/>
          <Redirect to="/" />
        </Switch>
      </div>
    </div>
  </BrowserRouter>
);

const Ratings = () => (<div>Under Construction</div>);

export default App;
