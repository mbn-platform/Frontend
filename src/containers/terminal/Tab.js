import React from 'react';
import classNames from 'classnames';
import { Col, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { UncontrolledTooltip } from 'reactstrap';

export class Tab extends React.PureComponent {
  render() {
    const { title, selected, onClick } = this.props;
    return (
      <Col onClick={onClick} xs="auto" className={classNames('tab', {selected})}>
        <FormattedMessage
          id={title}
          defaulMessage={title}
        />
        {this.renderTooltip()}
      </Col>
    );
  }

  renderTooltip() {
    if (this.props.tooltip) {
      return (
        <div id={this.props.tooltip}>
          <div className="table_header_help_wrapper"/>
          <UncontrolledTooltip target={this.props.tooltip}>
            <FormattedMessage
              id={this.props.tooltip}
            />
          </UncontrolledTooltip>
        </div>
      );
    }
  }
}
