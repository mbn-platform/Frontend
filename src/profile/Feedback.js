import React from 'react';
import { Container, Row, Col } from 'reactstrap';

class Feedback extends React.Component {

  render() {
    return (
      <Col xs="12" sm="12" md="12" lg="12" xl="4" className="feedback-block">
        <Container fluid className="h-100">
          <Row className="h-100">
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <div className="card feedback-card">
                <div className="card-header">
                  <div className="container-fuild h-100">
                    <div className="row h-100 align-items-center">
                      <div className="col-auto title-text">
                        <span className="icon icon-profit icon-004-megaphone"></span>FEEDBACKS
                      </div>
                      <div className="col">

                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {this.props.comments.map(Comment)}
                  </ul>
                  <div className="d-flex d-md-none justify-content-center show-next-block">
                    <button type="button" className="btn btn-secondary">show next 5 feedbacks</button>
                  </div>
                </div>

              </div>
            </Col>
          </Row>
        </Container>
      </Col>
    );

  }
}

const Comment = comment => (
  <li className="list-group-item d-none d-md-block">
    <article className="feedback-item">
      <div className="container-fuild">
        <div className="row">
          <div className="col-auto">
            <div className="name">@<u>{comment.name}</u></div>
          </div>
          <div className="col-auto">
            <div className="date">27.07.2017</div>
          </div>
          <div className="col-auto">
            <div className="raiting">
              <span className="icon icon-star active"></span>
              <span className="icon icon-star active"></span>
              <span className="icon icon-star active"></span>
              <span className="icon icon-star active"></span>
              <span className="icon icon-star active"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-feedback d-none d-md-block">{comment.text}</div>
    </article>
  </li>


);

export default Feedback;
