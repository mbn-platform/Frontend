import React from 'react';
import { Link } from 'react-router-dom';

class Contracts extends React.Component {
  render() {
    return (
      <div>
        <h2>Contracts</h2>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    if(this.props.contracts.length === 0) {
      return (<div>No contracts</div>);
    } else {
      return (
        <ul>
          {this.props.contracts.map(c => (
          <Contract contract={c} key={c.id}
            onContractSelected={this.props.onContractSelected}
            selected={this.props.selectedContract === c} />
          ))}
        </ul>
      );
    }
  }

}

const Contract = (props) => (
  <li style={props.selected ? {backgroundColor: 'green'} : {}} onClick={() => props.onContractSelected(props.contract)}>
    <Link to={props.contract.link}>{props.contract.name}</Link> <span>{props.contract.info}</span>
  </li>
);

export default Contracts;
