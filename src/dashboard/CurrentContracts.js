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
          {this.props.contracts.map(c => (
          <CurrentContract contract={c} key={c.id}
            onContractSelected={this.props.onContractSelected}
            selected={this.props.selectedContract === c} />
          ))}
        </ul>
      );
    }
  }

}

const CurrentContract = (props) => (
  <li style={props.selected ? {backgroundColor: 'green'} : {}} onClick={() => props.onContractSelected(props.contract)}>
    <Link to={props.contract.link}>{props.contract.name}</Link> <span>{props.contract.info}</span>
  </li>
);

export default CurrentContracts;
