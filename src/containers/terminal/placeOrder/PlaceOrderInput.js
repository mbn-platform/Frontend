import React from 'react';
import { Row, Col } from 'reactstrap';
import {FormattedMessage} from 'react-intl';

export class PlaceOrderInput extends React.PureComponent {

  render() {
    const { message, onChange, placeholder, value, name, currency } = this.props;
    return (
      <Row>
        <Col xs="3">
          <span className="buysell__form-label">
            <FormattedMessage
              id={message}
            />
          </span>
        </Col>
        <Col>
          <input
            onChange={onChange}
            placeholder={placeholder}
            value={value} type="number" name={name} className="buysell__form-input"/>
          <span className="buysell__form-input__label" >{currency}</span>
        </Col>
      </Row>
    );
  }
}
