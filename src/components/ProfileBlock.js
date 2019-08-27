import classNames from 'classnames';
import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import './ProfileBlock.css';

export class ProfileBlock extends React.PureComponent {
  render() {
    const { children, title, iconClassName, className, tooltip } = this.props;
    return (
      <Card className={classNames('profile-block', className)}>
        <CardHeader>
          <span className={classNames('icon', iconClassName)}/>
          <FormattedMessage id={title} />
          <Tooltip id={tooltip} />
        </CardHeader>
        <CardBody>
          {children}
        </CardBody>
      </Card>
    );
  }
}

function Tooltip({id}) {
  switch (id) {
    case 'tradeHistoryHelp':
      return (
        <span>
          <span id={id} className="d-none d-md-inline-block icon icon-help icon-help-web-button" />
          <UncontrolledTooltip hideArrow={true} trigger='click' target={id} placement="right">
            All completed trades are stored in the <Link to="/hashlog">Hashlog</Link>
          </UncontrolledTooltip>
        </span>
      );
    default:
      return null;
  }
}

