import classNames from 'classnames';
import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import './ProfileBlock.css';

export class ProfileBlock extends React.PureComponent {
  render() {
    const { children, title, iconClassName, className } = this.props;
    return (
      <Card className={classNames('profile-block', className)}>
        <CardHeader>
          <span className={classNames('icon', iconClassName)}/>
          <FormattedMessage id={title} />
        </CardHeader>
        <CardBody>
          {children}
        </CardBody>
      </Card>
    );
  }
}
