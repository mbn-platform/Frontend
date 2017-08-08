import React from 'react';
import { Link } from 'react-router-dom';
//const KEYS = [{name: 'key1', stock: 'bitrex', id: '123'}];
const KEYS = [{name: 'first key', keyValue: 'Acx123123DFdf', stock: 'Some Stock', key: 'Acx123123DFdf'}];
const CONTRACTS = [{name: 'Trader', link: '/trader', id: '1', info: 'Contract Info'}];

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <ApiKeys keys={KEYS}/>
    <CurrentContracts contracts={CONTRACTS}/>
  </div>
);

class ApiKeys extends React.Component {

  constructor(props) {
    super(props);
    this.state = {keys: props.keys} || {keys: []};
    this.onKeyCreated = this.onKeyCreated.bind(this);
    this.onKeyDeleted = this.onKeyDeleted.bind(this);
  }

  onKeyDeleted(key) {
    this.setState(prev => {
      return {keys: prev.keys.filter(k => k.key === key.key)};
    });
  }

  onKeyCreated(key) {
    console.log(JSON.stringify(key));
    console.log(this.state);
    this.setState(prev => {
      return {keys: prev.keys.concat(key)};
    });
  }

  render() {
    let content = null;
    if(this.state.keys.length === 0) {
      content = (<div>You have no keys yet</div>);
    } else {
      console.log(this.props.keys);
      content = (
        <ul>
          {this.state.keys.map(k => <ApiKey { ...k} onKeyDeleted={this.onKeyDeleted} />)}
        </ul>
        );
    }
    return (
      <div>
        <h2>Api keys</h2>
        {content}
        <AddKeyForm visible={this.state.addKeyFormVisible} onKeySubmit={this.onKeyCreated} />
      </div>
    );
  }
}

class AddKeyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onAddKeyButtonClick = this.onAddKeyButtonClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onAddKeyButtonClick() {
    this.setState(prev => {
      return {opened: !prev.opened};
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const key = this.state.key;
    const keyName = this.state.keyName;
    const stock = this.state.stock;
    this.props.onKeySubmit({name: keyName, keyValue: key, stock: stock, key: key});
    this.setState(this.initialState());
  }

  initialState() {
    return {opened: false, key: '', keyName: '', stock: 'Some Stock'};
  }

  renderAddButton() {
    if(!this.state.opened) {
      return (<button onClick={this.onAddKeyButtonClick}>Add key</button>);
    } else {
      return null;
    }
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  renderForm() {
    if(this.state.opened) {
      return (
        <form onSubmit={this.onSubmit}>
          <input placeholder="Key name" name="keyName" value={this.state.keyName} onChange={this.handleChange} />
          <input placeholder="Key" name="key" value={this.state.key} onChange={this.handleChange} />
          <select name="stock" value={this.state.stock} onChange={this.handleChange} >
            <option>Bitrex</option>
          </select>
          <input type="submit" value="Submit" />
          <input type="button" value="Cancel" onClick={this.onAddKeyButtonClick} />
        </form>
      );
    } else {
      return null;
    }
  }



  render() {
    return this.state.opened ? this.renderForm() : this.renderAddButton();
  }
}


class ApiKey extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDeleteClicked = this.onKeyDeleteClicked.bind(this);
  }

  onKeyDeleteClicked() {
    console.log(this.props);
    this.props.onKeyDeleted(this.props);
  }
  render() {
    return (
      <li key={this.props.key}>
        <span>{this.props.name}</span> <span>{this.props.keyValue}</span> <span>{this.props.stock}</span>  <span>{this.props.pairs}</span>  <button onClick={this.onKeyDeleteClicked}>Delete</button>
      </li>
    );
  }
}

const CurrentContracts = (props) => (
  <div>
    <h2>Current Contracts</h2>
    <ul>
      {props.contracts.map(c => <CurrentContract {...c} />)}
    </ul>
  </div>
  );

const CurrentContract = (props) => (
  <li key={props.id}>
    <Link to={props.link}>{props.name}</Link> <span>{props.info}</span>
  </li>
  );

export default Dashboard;
