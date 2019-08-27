import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ReactTable from 'react-table';
import Calculator from './Calculator';
import PaginationWithPage from '../../components/PaginationWithPage';
import { PaginationWithPageRight } from '../../components/PaginationWithPage';

class Rating extends React.Component {

  state = {
    selectedTrader: '',
    traders: [],
    nameFilter: '',
    showVerified: false,
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
          <div>
            <span style={{
              marginRight: '10px',
            }}>
              <input
                style={{
                  verticalAlign: 'middle',
                }}
                value={this.state.nameFilter}
                onChange={this.onNameFilterChange}
                type="text"
                className="ratings__input-search"
                placeholder='Search'
              />
            </span>
            <label className="rating-checkbox" style={{fontSize: '12px', color: '#7e8190'}}
            >
              <input
                style={{verticalAlign: 'middle', marginRight: '5px'}}
                onChange={this.onShowVerifiedToggle}
                type="checkbox"
                checked={this.state.showVerified}
              />
                Show only verified traders
            </label>
          </div>
          <RatingTable
            nameFilter={this.state.nameFilter}
            showVerified={this.state.showVerified}
            data={results}
            onTraderSelect={this.onTraderSelect}
          />
        </div>
      </div>
    );
  }

  onNameFilterChange = (e) => {
    this.setState({nameFilter: e.target.value});
  }

  onShowVerifiedToggle = (e) => {
    this.setState({showVerified: !this.state.showVerified});
  }
}

class RatingTable extends React.PureComponent {

  state = {
    page: 0,
    pageSize: 10,
    nameFilter: '',
  }

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
        minWidth: 100,
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
              defaultMessage="Description"
            />
          </div>
        </div>,
        sortable: false,
        minWidth: 360,
        className: 'ratings__table-cell user-info',
        accessor: 'info',
      }, {
        Header: <div
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.lastSevenUSDT"
              defaultMessage="Balance chart 7d, USDT"
            />
          </div>
        </div>,
        minWidth: 200,
        sortable: false,
        Cell: row => <img src={`/api/static/${row.value}_stat_usdt.png`} alt="" />,
        className: 'ratings__table-cell',
        accessor: 'name',
      }, {
        Header: <div
          className="table__header-wrapper">
          <div className="rating__header-title-wrapper">
            <FormattedMessage
              id="leaderboard.lastSevenBTC"
              defaultMessage="Balance chart 7d, BTC"
            />
          </div>
        </div>,
        minWidth: 200,
        sortable: false,
        Cell: row => <img src={`/api/static/${row.value}_stat_btc.png`} alt="" />,
        className: 'ratings__table-cell',
        accessor: 'name',
      }, {
        id: 'balanceStat',
        Header: (
          <div className="table__header-wrapper">
            <div className="rating__header-title-wrapper">Balance Under Management</div>
          </div>
        ),
        minWidth: 180,
        sortable: false,
        Cell: ({original: value}) => (
          <div>
            <div>Current USDT: <span className='usdt'>{value.ltusdt.current.toFixed(2)}</span></div>
            <div>Change USDT (7d): <span className='usdt'>{value.ltusdt.change.toFixed(2)}%</span></div>
            <br />
            <div>Current BTC: <span className='btc'>{value.ltbtc.current.toFixed(2)}</span></div>
            <div>Change BTC (7d): <span className='btc'>{value.ltbtc.change.toFixed(2)}%</span></div>
          </div>
        ),
        className: 'ratings__table-cell balance-stat',
      }, {
        Header: (
          <div className="table__header-wrapper">
            <div className="rating__header-title-wrapper">Contract Stats</div>
          </div>
        ),
        minWidth: 180,
        sortable: false,
        Cell: ({value}) => (
          <div>
            <div>Positive: {value.positive}</div>
            <div>Negative: {value.negative}</div>
            <br/>
            <br/>
            <br/>
          </div>
        ),
        className: 'ratings__table-cell contract-stat',
        accessor: 'contractStat',
      }, {
        Header: (
          <div className="table__header-wrapper">
            <div className="rating__header-title-wrapper">Contract settings</div>
          </div>
        ),
        minWidth: 180,
        sortable: false,
        Cell: ({value}) => (
          <div>
            <div>Target: {value.roi}%</div>
            <div>Max loss: {value.maxLoss}%</div>
            <div>Duration: {value.duration} days</div>
            <div>Fee: {value.fee}%</div>
            <div>Currency: {value.currency}</div>
          </div>
        ),
        className: 'ratings__table-cell contract-settings',
        accessor: 'contractSettings',
      }, {
        Header:<div className="table__header-wrapper">
          <div title="based on 6 months performance">
            Average Monthly ROI
          </div>
        </div>,
        minWidth: 100,
        className: 'ratings__table-cell',
        Cell: row => {
          return <div className="name nickname">{row.value.toFixed(2)}%</div>;
        },
        accessor: 'contractStat.avg6',
      }, {
        Header: '',
        className: 'ratings__table-cell justify-content-center',
        filterMethod: (filter, row) => {
          return !filter.value || row.verified;
        },
        Cell: row => {
          return (
            <Link to={'/' + row.original.name}>
              <button style={{verticalAlign: 'text-top', width: 'unset'}} className="leaderboard__form-submit">INVEST NOW</button>
            </Link>
          );
        },
        minWidth: 120,
        accessor: 'verified',
        sortable: false,
      }
    ];
  }

  getTrProps = (state, rowInfo) => {
    if (rowInfo) {
      const name = rowInfo.original.name;
      return {
        onClick: () => this.props.onTraderSelect(name),
      };
    } else {
      return {};
    }
  }

  render() {
    return (
      <ReactTable
        className='rating-table'
        columns={this.getColumns(this.props.screenWidth)}
        data={this.props.data}
        filtered={[{id: 'name', value: this.props.nameFilter}, {id: 'verified', value: this.props.showVerified}]}
        getTrProps={this.getTrProps}
        minRows={this.state.pageSize}
        page={this.state.page}
        resizable={false}
        pageSize={this.state.pageSize}
        noDataText=""
        showPagination={true}
        PaginationComponent={PaginationWithPageRight}
        paginationPageDispatcher={(p, ps) => {
          console.log(p, ps);
          this.setState({pageSize: ps, page: p});
        }}
        paginationPageSizeDispatcher={ps => {
          this.setState({pageSize: ps});
        }}
      />
    );
  }
}

export default Rating;
