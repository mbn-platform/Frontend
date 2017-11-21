import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import classNames from 'classnames';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import Scrollbars from 'react-custom-scrollbars';

class Feedback extends React.Component {

  constructor(props) {
    super(props);
    this.state = {page: 0, canPrevious: false, canNext: props.comments.length > this.props.pageSize, scrollHeight: 250};
    this.onPageChange = this.onPageChange.bind(this);
  }

  onPageChange(page) {
    this.setState({page,
      canNext: this.props.comments.length - page * this.props.pageSize > this.props.pageSize,
      canPrevious: page > 0
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({page: 0, canPrevious: false, canNext: nextProps.comments.length > this.props.pageSize});
  }

  componentDidMount() {
    setTimeout(() => {
      this.calcHeight();
    }, 1)
    window.addEventListener('resize', (e) => {
      this.calcHeight()
    });

  }  

  calcHeight() {
    this.setState({scrollHeight: this.divRef.clientHeight - 54})
  }


  render() {
    return (
      <Col xs="12" sm="12" md="12" lg="12" xl="4" className="feedback-block">
        <Container fluid className="h-100">
          <Row className="h-100">
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <div className="card feedback-card"  ref={element => this.divRef = element}>
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
                <Desktop>
                  <Scrollbars style={{height: this.state.scrollHeight }}>
                    <div className="card-body">
                      <ul className="list-group">
                        {this.props.comments.map((c, i) => <Comment key={i} comment={c}/>)}
                      </ul>
                    </div>
                  </Scrollbars>
                </Desktop>
                <Mobile>
                  <div className="card-body">
                    <ul className="list-group">
                      {this.renderMobile()}
                    </ul>
                    <Pagination
                      page={this.state.page}
                      canNext={this.state.canNext}
                      canPrevious={this.state.canPrevious}
                      onPageChange={this.onPageChange}
                    />
                  </div>
                </Mobile>
              </div>
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }

  renderMobile() {
    const data = this.props.comments.slice(this.state.page * this.props.pageSize,
      this.state.page * this.props.pageSize + this.props.pageSize);
    return (
      <Mobile>
        {data.map((c, i) => <Comment key={i} comment={c}/>)}
      </Mobile>
    );
  }
}

class Comment extends React.Component {

  renderStars() {
    const stars = [];
    for(let i = 0; i < 5; i++) {
      const className = classNames('icon', 'icon-star', {active: i < this.props.comment.raiting});
      stars.push((<span key={i} className={className} />));
    }
    return stars;
  }

  render() {
    const  comment = this.props.comment;
    return (
      <li className="list-group-item">
        <article className="feedback-item">
          <div className="container-fuild">
            <div className="row">
              <div className="col-auto">
                <div className="name">@<u>{comment.name}</u></div>
              </div>
              <div className="col-auto">
                <div className="date">{formatDate(new Date(comment.date))}</div>
              </div>
              <div className="col-auto">
                <div className="raiting">
                  {this.renderStars()}
                </div>
              </div>
            </div>
          </div>
          <div className="text-feedback">{comment.text}</div>
        </article>
      </li>
    );
  }
}

Feedback.defaultProps = {
  pageSize: 5
}

function formatDate(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if(month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if(day < 10) {
    day = '0' + day;
  }
  return day + '.' + month + '.' + year;
}

export default Feedback;
