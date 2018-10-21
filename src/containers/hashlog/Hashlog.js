import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getBlockListPage, setBlockListPage, setBlockListPageSize } from '../../actions/hashlog';
import { setBlockForActionList } from '../../actions/actionsList';
import ReactTable from '../../components/SelectableReactTable';
import createMqProvider, {querySchema} from '../../MediaQuery';
import PaginationWithPage from '../../components/PaginationWithPage';

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
    const { setActionBlock,  history} = this.props;
    history.push('/action-list?number=' + rowData.original.number);
    setActionBlock(rowData.original);
  }

  renderBlocklist = () => {
    const {
      hashlog: {blockList, totalBlocks, blocksPage, blocksPageSize},
      setBlocksPage,
      setBlocksPageSize,
      getBlocksPages
    } = this.props;
    return (
      <React.Fragment>
        <Screen on={screenWidth => (
          <ReactTable
            getTrProps={(state, rowInfo) => {
              return {
                onClick: () => this.onRowClick(rowInfo),
              };
            }}
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
        className: 'table_col_value hashlog__table-cell',
        minWidth: screenWidth === 'lg' ? 60 : 25  ,
      },
      {
        Header: this.props.intl.messages['hashlog.blockHash'],
        className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value',
        headerClassName: 'hashlog__table-header-title',
        minWidth: 100,
        accessor: 'hash'
      },
      {
        Header: this.props.intl.messages['hashlog.actionCount'],
        className: 'table_col_value hashlog__table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth:  screenWidth  === 'lg' ? 100 : 30,
        Cell: row => (
          <div>
            {row.original.actions.length}
          </div>
        ),
      },
      {
        Header: this.props.intl.messages['hashlog.createdAt'],
        className: 'table_col_value hashlog__table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth: screenWidth  === 'lg' ?  100 : 70,
        Cell: row => (
          <div>
            {new Date(row.original.createdAt).toLocaleTimeString()}
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

const mapDispatchToProps = dispatch => {
  return {
    getBlocksPages: (pages, size) => dispatch(getBlockListPage(pages, size)),
    setActionBlock: blockInfo => dispatch(setBlockForActionList(blockInfo)),
    setBlocksPage: page => dispatch(setBlockListPage(page)),
    setBlocksPageSize: pageSize => dispatch(setBlockListPageSize(pageSize)),
  };
};

export default withRouter(injectIntl(connect(state => state, mapDispatchToProps)(Hashlog)));
