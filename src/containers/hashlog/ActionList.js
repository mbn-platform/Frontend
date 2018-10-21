import React from 'react';
import {connect} from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getActionListPage, setActionListPage, setActionListPageSize } from '../../actions/actionsList';
import ReactTable from '../../components/SelectableReactTable';
import createMqProvider, {querySchema} from '../../MediaQuery';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import PaginationWithPage from '../../components/PaginationWithPage';

import qs from 'qs';

const {Screen} = createMqProvider(querySchema);

class ActionList extends React.Component {

  componentDidMount() {
    const { getActionList, actionList: { blockInfo }, actionListPage, actionListPageSiz} = this.props;
    const { number: currentBlockNumberFromUrl } = qs.parse(this.props.location.search.slice(1));
    getActionList(blockInfo.number || currentBlockNumberFromUrl, actionListPage, actionListPageSiz);
  };

  getBlockInfoColumns = screenWidth => {
    return [
      {
        Header: this.props.intl.messages['hashlog.blockListNumberTitle'],
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
      // {
      //   Header: this.props.intl.messages['hashlog.prevBlockHash'],
      //   className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value',
      //   headerClassName: 'hashlog__table-header-title',
      //   minWidth: 100,
      //   accessor: 'hash'
      // },
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

  getActionListColumns = screenWidth => {
    return [
      {
        Header: this.props.intl.messages['hashlog.index'],
        id: 'currency',
        accessor: 'version',
        headerClassName: 'hashlog__table-header-title',
        className: 'table_col_value hashlog__acion-list-table-cell',
        minWidth: screenWidth === 'lg' ? 60 : 10  ,
      },
      {
        Header: this.props.intl.messages['hashlog.id'],
        className: 'table_col_value hashlog__acion-list-table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth: screenWidth === 'lg' ? 60 : 35,
        accessor: 'keyId'
      },
      {
        Header: this.props.intl.messages['hashlog.record'],
        className: 'table_col_value hashlog__acion-list-table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth:  screenWidth  === 'lg' ? 100 : 60,
        Cell: row => (
          <div>
            <div className="hashlog__table-unformatted">
              <pre className='hashlog__table-unformatted-pre'>
                {
                  JSON.stringify({
                    type : row.original.type,
                    params: row.original.params,
                  }, null, '\t')
                }
              </pre>
            </div>
            <CopyToClipboard text={
              JSON.stringify({
                type : row.original.type,
                params: row.original.params,
              }, null, '\t')
            }>
              <button  className='hashlog__copy-button'>
                <FormattedMessage
                  id="hashlog.copy"
                  defaultMessage="Copy"
                />
              </button>
            </CopyToClipboard>
          </div>
        ),
      },
      {
        Header: this.props.intl.messages['hashlog.hash'],
        className: 'table_col_value hashlog__acion-list-table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth: screenWidth  === 'lg' ?  100 : 70,
        Cell: row => (
          <div>
            <div className='hashlog__copied-block'>
              {row.original.hash}
            </div>
            <CopyToClipboard text={
              row.original.hash
            }>
              <button  className='hashlog__copy-button'>
                <FormattedMessage
                  id="hashlog.copy"
                  defaultMessage="Copy"
                />
              </button>
            </CopyToClipboard>
          </div>
        )
      }
    ];
  }


  renderBlockInfoTable = () => {
    const {
      actionList: {
        blockInfo,
      },
    } = this.props;
    return (
      <React.Fragment>
        <Screen on={screenWidth => (
          <ReactTable
            data={[blockInfo]}
            columns={this.getBlockInfoColumns(screenWidth)}
            screenWidth={screenWidth}
          />)}
        />
      </React.Fragment>
    );
  };

  renderMobileActionList = actionsList => (
    <div className="hashlog__mobileActionListWrapper">
      {actionsList.map((actionsListItem, index) => {
        return (
          <div key={index} className="hashlog__mobileActionListItemWrapper">
            <div className="hashlog__mobileActionListRow">
              <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.index'] + ':'}</div>
              <div className="hashlog__mobileActionListValue">{actionsListItem.version}</div>
            </div>
            <div className="hashlog__mobileActionListRow">
              <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.id'] + ':'}</div>
              <div className="hashlog__mobileActionListValue">{actionsListItem.keyId}</div>
            </div>
            <div className="hashlog__mobileActionListRow">
              <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.record'] + ':'}</div>
              <div className="hashlog__mobileActionListValue"> <div className="hashlog__table-unformatted">
                <pre className='hashlog__table-unformatted-pre'>
                  {
                    JSON.stringify({
                      type : actionsListItem.type,
                      params: actionsListItem.params,
                    }, null, '\t')
                  }
                </pre>
              </div>
              <CopyToClipboard text={
                JSON.stringify({
                  type : actionsListItem.type,
                  params: actionsListItem.params,
                }, null, '\t')
              }>
                <button  className='hashlog__copy-button'>
                  <FormattedMessage
                    id="hashlog.copy"
                    defaultMessage="Copy"
                  />
                </button>
              </CopyToClipboard>
              </div>
            </div>
            <div className="hashlog__mobileActionListRow">
              <div className="hashlog__mobileActionListTitle">
                {this.props.intl.messages['hashlog.hash'] + ':'}
              </div>
              <div className="hashlog__mobileActionListValue">
                <div className='hashlog__copied-block'>
                  {actionsListItem.hash}
                </div>
                <CopyToClipboard text={
                  actionsListItem.hash
                }>
                  <button  className='hashlog__copy-button'>
                    <FormattedMessage
                      id="hashlog.copy"
                      defaultMessage="Copy"
                    />
                  </button>
                </CopyToClipboard></div>
            </div>
          </div>
        ); })
      })}
    </div>
  )



  renderActionListTable = () =>  {
    const {
      actionList: {
        actionsList,
        blockInfo,
        actionsListCount,
        actionListPage,
        actionListPageSize
      },
      setActionPage,
      setActionPageSize,
      getActionList,
    } = this.props;
    const { number: currentBlockNumberFromUrl } = qs.parse(this.props.location.search.slice(1));
    return (
      <React.Fragment>
        <Screen on={screenWidth => (
          screenWidth  === 'lg' ? <ReactTable
            data={actionsList}
            columns={this.getActionListColumns(screenWidth)}
            pages={Math.ceil(actionsListCount/actionListPageSize)}
            page={actionListPage}
            defaultPageSize={actionListPageSize}
            pageSize={actionListPageSize}
            showPagination={true}
            screenWidth={screenWidth}
            showPaginationBottom={true}
            manual
            paginationPageDispatcher={page => {
              setActionPage(page);
              getActionList(blockInfo.number || currentBlockNumberFromUrl, page, actionListPageSize);
            }}
            paginationPageSizeDispatcher={pageSize => {
              setActionPageSize(pageSize);
              getActionList(blockInfo.number || currentBlockNumberFromUrl, actionListPage, pageSize);
            }}
            onItemSelected={() => {}}
            PaginationComponent={PaginationWithPage}
          /> : this.renderMobileActionList(actionsList))}
        />
      </React.Fragment>
    );
  }


  render() {
    return (
      <Container fluid>
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__main-title">
                <FormattedMessage
                  id="hashlog.titleBlock"
                  defaultMessage="Hashlog"
                />
              </div>
              <div className="hashlog__main-board hashlog__info-board">
                {this.renderBlockInfoTable()}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__main-title">
                <FormattedMessage
                  id="hashlog.titleAction"
                  defaultMessage="Hashlog"
                />
              </div>
              <div className="hashlog__main-board">
                {this.renderActionListTable()}
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
});

const mapDispatchToProps = dispatch => {
  return {
    getActionList: (blockNumber, page, size) => dispatch(getActionListPage(blockNumber, page, size)),
    setActionPage: page => dispatch(setActionListPage(page)),
    setActionPageSize: pageSize => dispatch(setActionListPageSize(pageSize)),
  };
};


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ActionList));
