import React from 'react';
import {connect} from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
  getActionListPage,
  setActionListPage,
  setActionListPageSize,
  setBlockForActionList
} from '../../actions/actionsList';
import { getBlock } from '../../actions/hashlog';
import ReactTable from '../../components/SelectableReactTable';
import createMqProvider, {querySchema} from '../../MediaQuery';
import PaginationWithPage from '../../components/PaginationWithPage';

import qs from 'qs';

const {Screen} = createMqProvider(querySchema);

class ActionList extends React.Component {

  componentDidMount() {
    const {
      getActionList,
      actionList: { blockInfo },
      actionListPage,
      actionListPageSize,
      getCurrentBlock,
      setActionBlock
    } = this.props;
    const { blockNumber: currentBlockNumberFromUrl } = qs.parse(this.props.location.search.slice(1));
    if (blockInfo.blockNumber) {
      getActionList(blockInfo.blockNumber || currentBlockNumberFromUrl, actionListPage, actionListPageSize);
    } else {
      getCurrentBlock(currentBlockNumberFromUrl);
      getActionList(currentBlockNumberFromUrl);
    }
  };

  getBlockInfoColumns = screenWidth => {
    return [
      {
        Header: this.props.intl.messages['hashlog.blockListNumberTitle'],
        id: 'currency',
        accessor: 'blockNumber',
        headerClassName: 'hashlog__table-header-title',
        className: 'table_col_value hashlog__table-cell hashlog__acion-list-table-cell',
        minWidth: screenWidth === 'lg' ? 30 : 25,
      },
      {
        Header: this.props.intl.messages['hashlog.blockHash'],
        className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value',
        headerClassName: 'hashlog__table-header-title',
        minWidth: 160,
        accessor: 'blockHash'
      },
      {
        Header: this.props.intl.messages['hashlog.prevBlockHash'],
        className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value',
        headerClassName: 'hashlog__table-header-title ',
        minWidth: 160,
        accessor: 'prevBlockHash'
      },
      {
        Header: this.props.intl.messages['hashlog.actionCount'],
        className: 'table_col_value hashlog__table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth:  screenWidth  === 'lg' ? 40 : 30,
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

  getActionListColumns = screenWidth => {
    return [
      {
        Header: this.props.intl.messages['hashlog.index'],
        id: 'currency',
        headerClassName: 'hashlog__table-header-title',
        className: 'table_col_value hashlog__acion-list-table-cell',
        minWidth: screenWidth === 'lg' ? 60 : 10  ,
        Cell: row => (
          <div>
            {row.index + 1}
          </div>
        ),
      },
      {
        Header: this.props.intl.messages['hashlog.id'],
        className: 'table_col_value hashlog__acion-list-table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth: screenWidth === 'lg' ? 60 : 35,
        accessor: 'id'
      },
      {
        Header: this.props.intl.messages['hashlog.record'],
        className: 'table_col_value hashlog__acion-list-table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth:  screenWidth  === 'lg' ? 100 : 60,
        Cell: row => {
          console.warn();
          return (<div className="hashlog__table-unformatted-container">
            <div className="hashlog__table-unformatted">
              <pre className='hashlog__table-unformatted-pre'>
                {
                  JSON.stringify({
                    type: row.original.record.type,
                    params: row.original.record.params,
                  }, null, 2)
                }
              </pre>
            </div>
            <CopyToClipboard text={
              JSON.stringify({
                type: row.original.record.type,
                params: row.original.record.params,
              }, null, 2)
            }>
              <button className='hashlog__copy-button'>
                <FormattedMessage
                  id="hashlog.copy"
                  defaultMessage="Copy"
                />
              </button>
            </CopyToClipboard>
          </div>);
        },
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
      },
      {
        Header: this.props.intl.messages['hashlog.createdAt'],
        className: 'table_col_value hashlog__acion-list-table-cell',
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
          screenWidth  === 'lg' ?<ReactTable
            data={[blockInfo]}
            columns={this.getBlockInfoColumns(screenWidth)}
            screenWidth={screenWidth}
          /> : this.renderMobileBlockInfo(blockInfo)
        )}
        />
      </React.Fragment>
    );
  };

  renderMobileBlockInfo = blockInfo => (
    <div className="hashlog__mobileActionListWrapper">
      <div  className="hashlog__mobileActionListItemWrapper">
        <div className="hashlog__mobileActionListRow">
          <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.blockListNumberTitle']}</div>
          <div className="hashlog__mobileActionListValue">{blockInfo.blockNumber}</div>
        </div>
        <div className="hashlog__mobileActionListRow">
          <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.blockHash']}</div>
          <div className="hashlog__mobileActionListValue">{blockInfo.blockHash}</div>
        </div>
        <div className="hashlog__mobileActionListRow">
          <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.blockHash']}</div>
          <div className="hashlog__mobileActionListValue">{blockInfo.prevBlockHash}</div>
        </div>
        <div className="hashlog__mobileActionListRow">
          <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.actionCount']}</div>
          <div className="hashlog__mobileActionListValue">{blockInfo.actionsCount}</div>
        </div>
        <div className="hashlog__mobileActionListRow">
          <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.createdAt']}</div>
          <div className="hashlog__mobileActionListValue">{blockInfo.createdAt}</div>
        </div>
      </div>
    </div>
  )

  renderMobileActionList = actionsList => (
    <div className="hashlog__mobileActionListWrapper">
      {actionsList.map((actionsListItem, index) => {
        return (
          <div key={index} className="hashlog__mobileActionListItemWrapper">
            <div className="hashlog__mobileActionListRow">
              <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.index']}</div>
              <div className="hashlog__mobileActionListValue">{index + 1}</div>
            </div>
            <div className="hashlog__mobileActionListRow">
              <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.id']}</div>
              <div className="hashlog__mobileActionListValue">{actionsListItem.id}</div>
            </div>
            <div className="hashlog__mobileActionListRow">
              <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.record']}</div>
              <div className="hashlog__mobileActionListValue"> <div className="hashlog__table-unformatted">
                <pre className='hashlog__table-unformatted-pre'>
                  {
                    JSON.stringify({
                      type: actionsListItem.record.type,
                      params: actionsListItem.record.params,
                    }, null, 2)
                  }
                </pre>
              </div>
              <CopyToClipboard text={
                JSON.stringify({
                  type: actionsListItem.record.type,
                  params: actionsListItem.record.params,
                }, null, 2)
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
                {this.props.intl.messages['hashlog.hash']}
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
    const { blockNumber: currentBlockNumberFromUrl } = qs.parse(this.props.location.search.slice(1));
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
              getActionList(blockInfo.blockNumber || currentBlockNumberFromUrl, page, actionListPageSize);
            }}
            paginationPageSizeDispatcher={pageSize => {
              setActionPageSize(pageSize);
              getActionList(blockInfo.blockNumber || currentBlockNumberFromUrl, actionListPage, pageSize);
            }}
            onItemSelected={() => {}}
            PaginationComponent={PaginationWithPage}
          /> : this.renderMobileActionList(actionsList))}
        />
      </React.Fragment>
    );
  }


  render() {
    const {
      actionList: {
        blockInfo,
        actionListPage,
        actionListPageSize
      }
    } = this.props;
    const { blockNumber: currentBlockNumberFromUrl } = qs.parse(this.props.location.search.slice(1));
    const requestParams= qs.stringify(
      {
        'q.blockNumber': blockInfo.blockNumber || currentBlockNumberFromUrl,
        page: actionListPage,
        size:actionListPageSize
      }
    );
    return (
      <Container fluid>
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__action-list-table-wrapper">
                <div className="hashlog__main-title hashlog__action-list-main-title-wrapper">
                  <div className="hashlog__action-list-main-title">
                    <FormattedMessage
                      id="hashlog.titleBlock"
                      defaultMessage="Hashlog"
                    />
                  </div>
                </div>
                <div className="hashlog__info-board">
                  {this.renderBlockInfoTable()}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__action-list-table-wrapper">
                <div className="hashlog__main-title hashlog__action-list-main-title-wrapper">
                  <div className="hashlog__action-list-main-title">
                    <FormattedMessage
                      id="hashlog.titleAction"
                      defaultMessage="Hashlog"
                    />
                  </div>
                  <a href={`/api/v2/hashlog/actions?${requestParams}`}
                    target="_blank"
                    className="hashlog__export-to-json">
                    <FormattedMessage
                      id="hashlog.asJson"
                      defaultMessage="As JSON"
                    />
                  </a>
                </div>
                <div className="hashlog__action-list-table">
                  {this.renderActionListTable()}
                </div>
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
    getCurrentBlock: blockNumber => dispatch(getBlock(blockNumber)),
    setActionBlock: blockInfo => dispatch(setBlockForActionList(blockInfo)),
  };
};


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ActionList));
