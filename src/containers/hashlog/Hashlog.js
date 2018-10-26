import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import { getBlockListPage, setBlockListPage, setBlockListPageSize } from '../../actions/hashlog';
import { setBlockForActionList } from '../../actions/actionsList';
import ReactTable from '../../components/SelectableReactTable';
import createMqProvider, {querySchema} from '../../MediaQuery';
import PaginationWithPage from '../../components/PaginationWithPage';
import qs from 'qs';

const {Screen} = createMqProvider(querySchema);

class Hashlog extends React.Component {
  state = {
    selectedRound: 0,
    nameFilter: '',
    sort: {},
  };

  componentDidMount() {
    const {getBlocksPages, hashlog : {blocksPage, blocksPageSize}} = this.props;
    getBlocksPages(blocksPage, blocksPageSize);
  }

  onRowClick = rowData=> {
    const { 
      setActionBlock,
      history,
    } = this.props;
    const requestParams= qs.stringify({
      blockNumber: rowData.original.number,
    });
    history.push('/hashlog/actions/?' + requestParams);
    setActionBlock(rowData.original);
  }

  renderBlocklist = () => {
    const {
      hashlog: {blockList, totalBlocks, blocksPage, blocksPageSize},
      setBlocksPage,
      setBlocksPageSize,
      getBlocksPages,
    } = this.props;
    return (
      <React.Fragment>
        <Screen on={screenWidth => (
          <ReactTable
            data={blockList}
            columns={this.getColumns(screenWidth)}
            pages={Math.ceil(totalBlocks/blocksPageSize)}
            page={blocksPage}
            defaultPageSize={blocksPageSize}
            pageSize={blocksPageSize}
            showPagination={true}
            screenWidth={screenWidth}
            showPaginationBottom={true}
            manual
            paginationPageDispatcher={page => {
              setBlocksPage(page);
              getBlocksPages(page, blocksPageSize);
            }}
            paginationPageSizeDispatcher={pageSize => {
              setBlocksPageSize(pageSize);
              getBlocksPages(blocksPage, pageSize);
            }}
            onItemSelected={() => {}}
            PaginationComponent={PaginationWithPage}
          />)}
        />
      </React.Fragment>
    );
  }

  getColumns = screenWidth => {
    return [
      {
        Header: this.props.intl.messages['hashlog.blockNumber'],
        id: 'currency',
        accessor: 'number',
        headerClassName: 'hashlog__table-header-title',
        className: 'table_col_value hashlog__table-cell hashlog__table-cell-number-wrapper',
        minWidth: screenWidth === 'lg' ? 40 : 25  ,
        Cell: row => {
          const requestParams= qs.stringify(
            {
              'blockNumber': row.original.number,
            }
          );
          return (
            <a
              className="hashlog__table-cell-number"
              href={'/hashlog/actions/?' + requestParams}
              onClick={ e => {
                e.preventDefault();
                this.onRowClick(row);
              }}>
              {row.original.number}
            </a>
          );
        },
      },
      {
        Header: this.props.intl.messages['hashlog.blockHash'],
        className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value',
        headerClassName: 'hashlog__table-header-title',
        minWidth:  screenWidth  === 'lg' ? 170 : 90,
        accessor: 'hash'
      },
      {
        Header: this.props.intl.messages['hashlog.actionCount'],
        className: 'table_col_вvalue hashlog__table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth:  screenWidth  === 'lg' ? 50 : 30,
        Cell: row => (
          <div>
            {row.original.actionsCount}
          </div>
        ),
      },
      {
        Header: this.props.intl.messages['hashlog.createdAt'],
        className: 'table_col_value hashlog__table-cell hashlog__table-cell-time',
        headerClassName: 'hashlog__table-header-title',
        minWidth: screenWidth  === 'lg' ?  100 : 70,
        Cell: row => (
          <div>
            <FormattedDate
              value={new Date(row.original.createdAt)}
              year='numeric'
              month='2-digit'
              day='2-digit'
              hour="numeric"
              minute="numeric"
            />
          </div>
        ),
      }
    ];
  };

  render() {
    return (
      <Container fluid className="ratings">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__main-title">
                <FormattedMessage
                  id="hashlog.title"
                  defaultMessage="Hashlog"
                />
              </div>
              <div className="hashlog__main-board">
                {this.renderBlocklist()}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  actionList: state.actionList,
  hashlog: state.hashlog,
});

const mapDispatchToProps = dispatch => {
  return {
    getBlocksPages: (pages, size) => dispatch(getBlockListPage(pages, size)),
    setActionBlock: blockInfo => dispatch(setBlockForActionList(blockInfo)),
    setBlocksPage: page => dispatch(setBlockListPage(page)),
    setBlocksPageSize: pageSize => dispatch(setBlockListPageSize(pageSize)),
  };
};

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(Hashlog)));
