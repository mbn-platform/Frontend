import classNames from 'classnames';
import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import './ProfileBlock.css';

export class ProfileBlock extends React.PureComponent {
  render() {
    const { children, title, titleComponent, iconClassName, className, Tooltip } = this.props;
    return (
      <Card className={classNames('profile-block', className)}>
        <CardHeader>
          <span className={classNames('icon', iconClassName)}/>
          {titleComponent ? titleComponent : <FormattedMessage className="title" id={title} /> }
          {Tooltip ? <Tooltip /> : null}
        </CardHeader>
        <CardBody>
          {children}
        </CardBody>
      </Card>
    );
  }
}

export function TradeHistoryHelpTooltip() {
  return (
    <span className="help-tooltip d-none d-md-inline-block">
      <span id='tradeHistoryHelp' className="icon-help-web-button" />
      <UncontrolledTooltip hideArrow={true} trigger='click' target='tradeHistoryHelp' placement="right">
          All completed trades are stored in the <Link to="/hashlog">Hashlog</Link>
      </UncontrolledTooltip>
    </span>
  );
}
export function ShowVerifiedTooltip() {
  return (
    <span style={{color: '#6f6f71'}} className="help-tooltip">
      <span id='tradeHistoryHelp' className="icon-help-web-button" />
      <UncontrolledTooltip hideArrow={true} target='tradeHistoryHelp' placement="right">
        Traders, who confirmed account via Telegram. Updates every 30 min
      </UncontrolledTooltip>
    </span>
  );
}
export function AssetsUnderManagementHelpTooltip() {
  return (
    <span className="help-tooltip d-none d-md-inline-block">
      <span id='assetsHelp' className="icon-help-web-button" />
      <UncontrolledTooltip hideArrow={true} target='assetsHelp' placement="right">
          Amount of INVESTORS assets
      </UncontrolledTooltip>
    </span>
  );
}

export function BalanceChartHelpTooltip() {
  return (
    <span className="help-tooltip d-none d-md-inline-block">
      <span id='balanceChartHelp' className="icon-help-web-button" />
      <UncontrolledTooltip hideArrow={true} target='balanceChartHelp' placement="right">
          PERSONAL assets summarise with INVESTORS assets
      </UncontrolledTooltip>
    </span>
  );
}
