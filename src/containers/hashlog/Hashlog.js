import React from 'react';
import {connect} from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getBlockListPage, setBlockListPage, setBlockListPageSize } from '../../actions/hashlog';
import ReactTable from '../../components/SelectableReactTable';
import createMqProvider, {querySchema} from '../../MediaQuery';
import PaginationWithPage from '../../components/PaginationWithPage';

const {MediaQuery, Screen} = createMqProvider(querySchema);

class Hashlog extends React.Component {
  state = {
    selectedRound: 0,
    nameFilter: '',
    sort: {},
  };

  componentDidMount() {
    const {getBlocksPages, blocksPage, blocksPageSize} = this.props;
    getBlocksPages(blocksPage, blocksPageSize);
  }

  renderBlocklist() {
    const {
      hashlog: {blockList, totalBlocks, blocksPage, blocksPageSize},
      setBlocksPage,
      setBlocksPageSize,
      getBlocksPages
    } = this.props;
    return (
      <React.Fragment>
        <MediaQuery>
          <Screen on={screenWidth => (
            <ReactTable
              data={blockList}
              columns={this.getColumns()}
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
        </MediaQuery>
      </React.Fragment>
    );
  }

  getColumns() {
    return [
      {
        Header: this.props.intl.messages['hashlog.blockNumber'],
        id: 'currency',
        accessor: 'number',
        headerClassName: 'hashlog__table-header-title',
        className: 'table_col_value',
        minWidth: window.matchMedia('(max-width: 1028px)') ? 25 : 60,
      },
      {
        Header: this.props.intl.messages['hashlog.blockHash'],
        className: 'table_col_value',
        headerClassName: 'hashlog__table-header-title',
        minWidth: 100,
        accessor: 'hash'
      },
      {
        Header: this.props.intl.messages['hashlog.actionCount'],
        className: 'table_col_value',
        headerClassName: 'hashlog__table-header-title',
        minWidth: window.matchMedia('(max-width: 1028px)') ? 30 : 100,
        accessor: 'actions'
      },
      {
        Header: this.props.intl.messages['hashlog.createdAt'],
        className: 'table_col_value',
        headerClassName: 'hashlog__table-header-title',
        minWidth: window.matchMedia('(max-width: 1028px)') ? 70 : 100,
        accessor: 'createdAt'
      }
    ];

  }

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
    setBlocksPage: page => dispatch(setBlockListPage(page)),
    setBlocksPageSize: pageSize => dispatch(setBlockListPageSize(pageSize)),
  };
};

export default injectIntl(connect(state => state, mapDispatchToProps)(Hashlog));
