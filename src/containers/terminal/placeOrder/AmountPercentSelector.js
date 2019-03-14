import React from 'react';
import { Col, Row } from 'reactstrap';

export class AmountPercentSelector extends React.PureComponent {
  render() {
    const { percents, onClick } = this.props;
    return (
      <Row>
        <Col xs="3" />
        <Col>
          <Row>
            {percents.map((p, i) => (
              <Col
                key={i}
                onClick={() => onClick(p)}
              >
                <input
                  className='buysell__form-input percent'
                  value={p + '%'}
                  disabled
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    );
  }
}
