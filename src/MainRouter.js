import { BrowserRouter, NavLink, Route, Redirect } from 'react-router-dom';
import logo from './Logo.svg';
import React from 'react';
import Dashboard from './dashboard/DashboardContainer';

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
      <ProtectedRoute path='/dashboard' component={Dashboard} />
    </div>
  </BrowserRouter>
);

const auth = {
  isAuthorized: true
}

const Login = () => {
  if(!window.web3) {
    return (<div>Install meta mask</div>);
  } else {
    return (<button>Log in</button>);
  }
}

class ProtectedRoute extends React.Component {


  render() {
    console.log(auth);
    const Component = this.props.component;
    return (<Route exact path={this.props.path} render={() => auth.isAuthorized ? (
      <Component />
      ) : (
      <Redirect to="/login" />
      )
      }/>)
  }
}




export default MainRouter;
