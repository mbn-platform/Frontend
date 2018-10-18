import React from 'react';
import {connect} from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getBlockListPage, setBlockListPage, setBlockListPageSize } from '../../actions/hashlog';
import ReactTable from '../../components/SelectableReactTable';
import createMqProvider, {querySchema} from '../../MediaQuery';
import PaginationWithPage from '../../components/PaginationWithPage';

const {Screen} = createMqProvider(querySchema);

class ActionList extends React.Component {

  renderBlockInfoTable = () => {
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


  render() {
    return (
      <Container fluid className="ratings">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__main-title">
                <FormattedMessage
                  id="hashlog.titleBlock"
                  defaultMessage="Hashlog"
                />
              </div>
              <div className="hashlog__main-board">
                {this.renderBlockInfoTable()}
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


export default injectIntl(connect(state => state, mapDispatchToProps)(ActionList));
