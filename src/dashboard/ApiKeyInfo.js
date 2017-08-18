import React from 'react';
const availablePairs = ['BTC-BCC', 'BTC-NEO', 'BTC-ETH'];

class ApiKeyInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {pairs: availablePairs};
    this.filterList = this.filterList.bind(this);
  }

  filterList(e) {
    const filter = e.target.value.toLowerCase();
    const filtered = availablePairs.filter(pair => pair.toLowerCase().search(filter) !== -1);
    this.setState({pairs: filtered});
  }


  render() {
    return (
      <div>
        <h2>ApiKey Info</h2>
        <input placeholder="Search" onChange={this.filterList} />
        {this.props.apiKey ? (
        <ul>
          {this.state.pairs.map(p => {
            const pairEnabled = this.props.apiKey.pairs.indexOf(p) !== -1;
            return (
          <li key={p}>
            <label><input type="checkbox" checked={pairEnabled}/>{p}</label>
          </li>
            );
          })}
        </ul>
        ): (<div>No api key selected</div>)}
      </div>
    );

  }
}

export default ApiKeyInfo;
