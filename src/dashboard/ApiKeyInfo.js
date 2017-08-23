import React from 'react';


class ApiKeyInfo extends React.Component {

  getAvailablePairs() {
    if(!this.props.apiKey) {
      return [];
    }
    const exchange = this.props.exchanges.find(ex => ex.name === this.props.apiKey.exchange);
    return exchange ? exchange.pairs : [];
  }

  render() {
    return (
      <div>
        <h2>KEY'S PAIRS</h2>
        <PairsList
          apiKey={this.props.apiKey}
          availablePairs={this.getAvailablePairs()}
          onKeyUpdate={this.props.onKeyUpdateClick} />
      </div>
      );
  }
}

class PairsList extends React.Component {
  constructor(props) {
    super(props);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancelChangesClick = this.onCancelChangesClick.bind(this);
    this.onCheckAllClicked = this.onCheckAllClicked.bind(this);
    this.onSaveChangesClick = this.onSaveChangesClick.bind(this);
    this.state = {
      filter: '',
      changed: false,
      filteredData: props.availablePairs,
      checkedPairs: props.apiKey ? new Set(props.apiKey.pairs) : null
    }
  }

  onSaveChangesClick() {
    const key = {...this.props.apiKey,
      pairs: Array.from(this.state.checkedPairs)
    };
    this.props.onKeyUpdate(key);
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.apiKey) {
      this.setState({changed: false, filteredData: null, checkedPairs: null});
    } else {
      this.setState(state => ({
        changed: false,
        checkedPairs: new Set(nextProps.apiKey.pairs),
        filteredData: nextProps.availablePairs, filter: ''}));
    }
  }

  onChange(e) {
    const checked = e.target.checked;
    const index = e.target.dataset.index;
    const pair = this.state.filteredData[index];
    if(checked) {
      this.state.checkedPairs.add(pair);
    } else {
      this.state.checkedPairs.delete(pair);
    }
    if(!this.state.changed) {
      this.setState({changed: true});
    }
    this.forceUpdate();
  }

  onFilterChange(e) {
    const value = e.target.value;
    this.setState({filter: value});
    if(!this.props.apiKey) {
      return;
    }
    if(!value) {
      this.setState({filteredData: this.props.availablePairs});
    } else {
      const filter = value.toLowerCase();
      const filtered = this.props.availablePairs.filter(pair => pair.toLowerCase().indexOf(filter) !== -1);
      this.setState({filteredData: filtered});
    }
  }

  onCancelChangesClick() {
    this.setState({
      checkedPairs: new Set(this.props.apiKey.pairs),
      changed: false
    });
  }

  onCheckAllClicked() {
    if(!this.props.apiKey) {
      return;
    }
    if(this.state.checkedPairs.size === this.props.availablePairs.length) {
      this.setState({
        checkedPairs: new Set(),
        changed: true
      });
    } else {
      this.setState({
        checkedPairs: new Set(this.props.availablePairs),
        changed: true
      });
    }
  }

  renderPairs() {
    if(this.props.apiKey && this.state.filteredData) {
      return this.state.filteredData.map((pair, i) => (
        <PairRow
          key={pair}
          index={i}
          pair={pair}
          checked={this.state.checkedPairs.has(pair)}
          onChange={this.onChange}
        />
        ));
    } else {
      return null;
    }
  }

  renderSubmit() {
    if(this.state.changed) {
      return (
        <tr>
          <td>
            SAVE CHANGES?
            <button onClick={this.onSaveChangesClick}>YES</button>
            <button onClick={this.onCancelChangesClick}>NO</button>
          </td>
        </tr>
        );
    } else {
      return null;
    }
  }

  render() {
    return (
      <table>
        <th>
          <div>Pairs</div>
          <input placeholder="Search" value={this.state.filter}  onChange={this.onFilterChange} />
        </th>
        <th>Status<button onClick={this.onCheckAllClicked}>check all</button></th>
        {this.renderPairs()}
        {this.renderSubmit()}
      </table>
      );
  }
}

const PairRow = ({ index, pair, checked, onChange }) => (
  <tr>
    <td>{pair}</td>
    <td>
      <input type="checkbox" data-index={index} checked={checked} onChange={onChange}/>
    </td>
  </tr>
);

export default ApiKeyInfo;
