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
    this.props.updateRatings();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.selectedTrader) {
      if (this.props.ratings && this.props.ratings.length) {
        this.setState({selectedTrader: this.props.ratings[0].name});
      }
    }

    if (prevProps.ratings !== this.props.ratings && this.props.ratings) {
      const traders = this.props.ratings.map((t) => t.name);
      this.setState({traders});
    }
  }

  onTraderSelect = (name) => {
    this.setState({selectedTrader: name});
  }

  render() {
    let results = this.props.ratings;
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

  state = {
    nameFilter: '',
  }

  onNameFilterChange = (e) => {
    this.setState({nameFilter: e.target.value});
  }

  onNameFilterClick = (e) => e.stopPropagation();

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
          <div>
            <input ref={this.inputRef}
              onClick={this.onNameFilterClick}
              value={this.state.nameFilter}
              onChange={this.onNameFilterChange}
              type="text"
              className="ratings__input-search"
              placeholder='Search' />
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
              id="leaderboard.intro"
              defaultMessage="Introducing"
            />
          </div>
        </div>,
        minWidth: screenWidth === 'lg' ? 80 : 50,
        className: 'ratings__table-cell',
        accessor: 'info',
      }, {
        Header: <div
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.lastSeven"
              defaultMessage="Seven days balance, USDT"
            />
          </div>
        </div>,
        minWidth: 180,
        sortable: false,
        Cell: row => <img src={`/api/static/${row.value}_stat_usdt.png`} alt="" />,
        className: 'ratings__table-cell',
        accessor: 'name',
      }, {
        Header: <div
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.lastSeven"
              defaultMessage="Seven days balance, BTC"
            />
          </div>
        </div>,
        minWidth: 180,
        sortable: false,
        Cell: row => <img src={`/api/static/${row.value}_stat_btc.png`} alt="" />,
        className: 'ratings__table-cell',
        accessor: 'name',
      }, {
        id: 'stat',
        Header: <div
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.lastSeven"
              defaultMessage="Stat"
            />
          </div>
        </div>,
        minWidth: 180,
        sortable: false,
        Cell: row => (
          <div>
            <div>Positive: {row.original.positive}</div>
            <div>Negative: {row.original.negative}</div>
            <div>Average: {row.original.average}</div>
          </div>
        ),
        className: 'ratings__table-cell',
      }, {
        Header: '',
        id: 'request',
        className: 'ratings__table-cell justify-content-center',
        Cell: row => {
          return (
            <Link to={'/' + row.value}>
              <button style={{verticalAlign: 'text-top', width: 'unset'}} className="leaderboard__form-submit">INVEST NOW</button>
            </Link>
          );
        },
        minWidth: 120,
        accessor: 'name',
        sortable: false,
      }
    ];
  }

  getTrProps = (state, rowInfo) => {
    const name = rowInfo.original.name;
    return {
      onClick: () => this.props.onTraderSelect(name),
    };
  }

  render() {
    return (
      <ReactTable
        className='rating-table'
        columns={this.getColumns(this.props.screenWidth)}
        data={this.props.data}
        scrollBarHeight={500}
        filtered={[{id: 'name', value: this.state.nameFilter}]}
        getTrProps={this.getTrProps}
      />
    );
  }
}

export default Rating;
