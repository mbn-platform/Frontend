import React from 'react';
import { Link } from 'react-router-dom';

class CurrentContracts extends React.Component {
  render() {
    return (
      <div>
        <h2>Current Contracts</h2>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    if(this.props.contracts.length === 0) {
      return (<div>No current contracts</div>);
    } else {
      return (
        <ul>
          {this.props.contracts.map(c => <CurrentContract {...c} key={c.id} />)}
        </ul>
      );
    }
  }

}

const CurrentContract = (props) => (
  <li key={props.id}>
    <Link to={props.link}>{props.name}</Link> <span>{props.info}</span>
  </li>
);
export default CurrentContracts;
