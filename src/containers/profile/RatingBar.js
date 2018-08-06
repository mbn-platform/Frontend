import React from 'react';
import { Row, Container, Col } from 'reactstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class RatingBar extends React.Component {
  static defaultProps = {
    numberOfStars: 5,
    rating: 0
  }

  renderStars() {
    const stars = [];
    for(let i = 0; i < this.props.numberOfStars; i++) {
      const className = classNames('star', {active: i < this.props.rating});
      const star = (
        <Col key={i} xs="auto">
          <div className={className}></div>
        </Col>
      );
      stars.push(star);
    }
    return stars;
  }

  render() {
    return (
      <Row className="justify-content-center">
        <Col xs="8" sm="8" md="12" lg="9" xl="9">
          <Container fluid>
            <Row className="justify-content-center">
              {this.renderStars()}
            </Row>
          </Container>
        </Col>
      </Row>
    );
  }
}

RatingBar.propTypes = {
  numberOfStars: PropTypes.number,
  rating: PropTypes.number
}

export default RatingBar;
