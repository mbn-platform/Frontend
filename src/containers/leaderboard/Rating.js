import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ReactTable from '../../components/SelectableReactTable';
import Calculator from './Calculator';

class Rating extends React.Component {

  state = {
    selectedTrader: '',
    traders: [],
  }

  componentDidMount() {
    this.props.updateChallenge(0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.selectedTrader) {
      if (this.props.challenge &&
        this.props.challenge.global &&
        this.props.challenge.results.length) {
        this.setState({selectedTrader: this.props.challenge.results[0].name});
      }
    }

    if (prevProps.challenge !== this.props.challenge && this.props.challenge
      && this.props.challenge.global) {
      const traders = this.props.challenge.results.map((t) => t.name);
      this.setState({traders});
    }
  }

  onTraderSelect = (name) => {
    this.setState({selectedTrader: name});
  }

  render() {
    let results = [];
    const {challenge} = this.props;
    if (challenge) {
      results = challenge.results;
    }
    return (
      <div>
        <Calculator
          calculation={this.props.challenge && this.props.challenge.calculation}
          trader={this.state.selectedTrader}
          onTraderSelect={this.onTraderSelect}
          traders={this.state.traders}
          calculateTraderProfit={this.props.calculateTraderProfit} />
        <div className="ratings-main__title">
          Traders
        </div>
        <div className="ratings-main__block">
          <RatingTable
            data={results}
            onTraderSelect={this.onTraderSelect}
          />
        </div>
      </div>
    );
  }
}

class RatingTable extends React.PureComponent {

  getColumns = (screenWidth) => {
    return [
      {
        Header: null,
        maxWidth: screenWidth === 'lg' ? 80 : 40,
        className: 'ratings__table-cell',
        Cell: row =>
          (
            <div>
              {row.viewIndex + 1}
            </div>
          ),
        sortable: false,
      }, {
        Header:<div className="table__header-wrapper">
          <div>
            <FormattedMessage
              id="leaderboard.name"
              defaultMessage="Name"
            />
          </div>
        </div>,
        minWidth: 80,
        className: 'ratings__table-cell',
        Cell: row => {
          return <div className="name nickname">@{row.value}</div>;
        },
        accessor: 'name',
      }, {
        Header: <div
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.average"
              defaultMessage="Average"
            />
          </div>
        </div>,
        minWidth: screenWidth === 'lg' ? 80 : 50,
        Cell: row => row.original.average,
        className: 'ratings__table-cell',
      }, {
        Header: '',
        id: 'request',
        Cell: row => {
          return (
            <Link onClick={e => e.stopPropagation()} to={'/' + row.value}>
              <button style={{verticalAlign: 'text-top', width: 'unset'}} className="leaderboard__form-submit">INVEST NOW</button>
            </Link>
          );
        },
        accessor: 'name',
        sortable: false,
      }
    ];
  }

  render() {
    return (
      <ReactTable
        className='rating-table'
        columns={this.getColumns(this.props.screenWidth)}
        data={this.props.data}
        scrollBarHeight={500}
        getTrProps={(state, rowInfo) => ({
          onClick: (e) => {
            const name = rowInfo.original.name;
            this.props.onTraderSelect(name);
          },
        })}
      />
    );
  }
}

export default Rating;
