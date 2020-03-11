import React from 'react';
import {connect} from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { compose } from 'ramda';
import qs from 'qs';

import createMqProvider, { querySchema } from 'MediaQuery';
import ReactTable from 'components/SelectableReactTable';
import PaginationWithPage from 'components/PaginationWithPage';
import {
  getActionListPage,
  setActionListPage,
  setActionListPageSize,
} from 'actions/actionsList';
import { getBlock } from 'actions/hashlog';
import { actionListSelector } from 'selectors/actionList';

const { Screen } = createMqProvider(querySchema);

class ActionList extends React.Component {
  state = {
    actionAnchor: null,
  };

  componentDidMount() {
    const {
      getActionList,
      actionList: { blockInfo },
      actionListPage,
      actionListPageSize,
      getCurrentBlock,
    } = this.props;
    const { blockNumber: currentBlockNumberFromUrl } = qs.parse(this.props.location.search.slice(1));
    if (blockInfo.blockNumber) {
      getActionList(blockInfo.blockNumber || currentBlockNumberFromUrl, actionListPage, actionListPageSize);
    } else {
      getCurrentBlock(currentBlockNumberFromUrl);
      getActionList(currentBlockNumberFromUrl);
    }
  };

  static getDerivedStateFromProps({ actionList: { actionsList }, location }, prevState) {
    if (actionsList.length > 0) {
      return {
        actionAnchor: location.hash,
      };
    }
  }

  getBlockInfoColumns = screenWidth => {
    return [
      {
        Header: this.props.intl.messages['hashlog.blockHash'],
        className: 'table_col_value hashlog__table-cell hashlog__table-cell_hash-value',
        headerClassName: 'hashlog__table-header-title',
        minWidth: 160,
        accessor: 'hash'
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
        minWidth: screenWidth === 'lg' ? 30 : 10  ,
        Cell: row => (
          <div id={`action-${row.original.blockIndex}`}>
            {row.original.blockIndex}
          </div>
        )
      },
      {
        Header: this.props.intl.messages['hashlog.record'],
        className: 'table_col_value hashlog__acion-list-table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth:  screenWidth  === 'lg' ? 140 : 60,
        Cell: row => {
          const paramsText = row.original.record === null ? {} :
            JSON.stringify({
              type: row.original.record.type,
              timestamp: row.original.record.timestamp,
              params: row.original.record.params,
            }, null, 2);

          return (
            <div className="hashlog__table-unformatted-container">
              {(row.original.record === null || row.original.record.params === null) ? (
                <div className="hashlog__table-no-data">
                  &#8212;
                </div>
              ) : (
                <React.Fragment>
                  <div className="hashlog__table-unformatted">
                    <pre className='hashlog__table-unformatted-pre'>
                      {paramsText}
                    </pre>
                  </div>
                  <CopyToClipboard text={paramsText}>
                    <button className='hashlog__copy-button'>
                      <FormattedMessage
                        id="hashlog.copy"
                        defaultMessage="Copy"
                      />
                    </button>
                  </CopyToClipboard>
                </React.Fragment>
              )}
            </div>
          );
        },
      },
      {
        Header: this.props.intl.messages['hashlog.hash'],
        className: 'table_col_value hashlog__acion-list-table-cell',
        headerClassName: 'hashlog__table-header-title',
        minWidth: screenWidth  === 'lg' ?  200 : 70,
        Cell: row => (
          <div>
            <div className='hashlog__copied-block'>
              {row.original.hash}
            </div>
            <CopyToClipboard text={row.original.hash}>
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
    const { actionList: { blockInfo } } = this.props;

    return (
      <React.Fragment>
        <Screen on={screenWidth => (
          screenWidth  === 'lg' ? (
            <ReactTable
              data={[blockInfo]}
              columns={this.getBlockInfoColumns(screenWidth)}
              screenWidth={screenWidth}
            />
          ) : this.renderMobileBlockInfo(blockInfo)
        )}
        />
      </React.Fragment>
    );
  };

  renderMobileBlockInfo = blockInfo => (
    <div className="hashlog__mobileActionListWrapper">
      <div  className="hashlog__mobileActionListItemWrapper">
        <div className="hashlog__mobileActionListRow">
          <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.blockHash']}</div>
          <div className="hashlog__mobileActionListValue">{blockInfo.hash}</div>
        </div>
        <div className="hashlog__mobileActionListRow">
          <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.prevBlockHash']}</div>
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
      {actionsList.map((actionsListItem, index) => (
        <div key={index} className="hashlog__mobileActionListItemWrapper">
          <div className="hashlog__mobileActionListRow" id={`action-${actionsListItem.blockIndex}`}>
            <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.index']}</div>
            <div className="hashlog__mobileActionListValue">{actionsListItem.blockIndex}</div>
          </div>
          <div className="hashlog__mobileActionListRow">
            <div className="hashlog__mobileActionListTitle">{this.props.intl.messages['hashlog.record']}</div>
            <div className="hashlog__mobileActionListValue">
              <div className="hashlog__table-unformatted-container">
                {(actionsListItem.record === null || actionsListItem.record.params === null) ?
                  <div className="hashlog__table-no-data">
                    &#8212;
                  </div> :
                  <React.Fragment>
                    <div className="hashlog__table-unformatted">
                      <pre className='hashlog__table-unformatted-pre'>
                        {JSON.stringify({
                          type: actionsListItem.record.type,
                          timestamp: actionsListItem.record.timestamp,
                          params: actionsListItem.record.params,
                        }, null, 2)}
                      </pre>
                    </div>
                    <CopyToClipboard text={
                      JSON.stringify({
                        type: actionsListItem.record.type,
                        params: actionsListItem.record.params,
                        timestamp: actionsListItem.record.timestamp,
                      }, null, 2)
                    }>
                      <button className='hashlog__copy-button'>
                        <FormattedMessage
                          id="hashlog.copy"
                          defaultMessage="Copy"
                        />
                      </button>
                    </CopyToClipboard>
                  </React.Fragment>
                }
              </div>
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
              <CopyToClipboard text={actionsListItem.hash}>
                <button  className='hashlog__copy-button'>
                  <FormattedMessage
                    id="hashlog.copy"
                    defaultMessage="Copy"
                  />
                </button>
              </CopyToClipboard></div>
          </div>
        </div>
      ))})}
    </div>
  )

  renderActionListTable = () =>  {
    let {
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
          screenWidth  === 'lg' ? (
            <ReactTable
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
            />
          ) : this.renderMobileActionList(actionsList))}
        />
      </React.Fragment>
    );
  }


  render() {
    const { actionList: { blockInfo } } = this.props;
    const { actionAnchor } = this.state;
    const { blockNumber: currentBlockNumberFromUrl } = qs.parse(this.props.location.search.slice(1));

    if (actionAnchor) {
      const searchingElement = document.getElementById(actionAnchor.substr(1));
      searchingElement && searchingElement.scrollIntoView();
    }

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
                      defaultMessage="Block #{number}"
                      values={{number: blockInfo.number  || currentBlockNumberFromUrl}}
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
                  <a href={`/api/v2/hashlog/blocks/${blockInfo.number || currentBlockNumberFromUrl}/actions`}
                    target="_blank"
                    rel="noopener noreferrer"
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
  actionList: actionListSelector(state),
});

const mapDispatchToProps = {
  getActionList: getActionListPage,
  setActionPage: setActionListPage,
  setActionPageSize: setActionListPageSize,
  getCurrentBlock: getBlock,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
)(ActionList);
