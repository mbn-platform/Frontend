import React from 'react';
import ReactPlayer from 'react-player/youtube';
import { FormattedMessage } from 'react-intl';
import { Container, Row, Col } from 'reactstrap';

export default class FAQ extends React.Component {

  componentDidMount() {
    this.setState({links: [
      {
        title: '#1 How to connect your wallet',
        url: 'https://www.youtube.com/watch?v=rwCN-pBY3YQ',
      },{
        title: '#2 Setup Account and Contract Settings',
        url: 'https://www.youtube.com/watch?v=bFHLd7Br6ZM',
      },{
        title: '#3 Telegram bot verification',
        url: 'https://www.youtube.com/watch?v=scSScfBxySE',
      },{
        title: '#4 Service plans on MBN.global: overview and purchasing',
        url: 'https://www.youtube.com/watch?v=y3pR4RyjH14',
      },{
        title: '#5 API Keys: how to connect API Keys ',
        url: 'https://www.youtube.com/watch?v=vrkJ9mPXJ74',
      },{
        title: '#6 How to conclude investment contract with Asset Manager',
        url: 'https://www.youtube.com/watch?v=2cvF7Z1q5ds',
      },
    ]});
  }

  state = {
    links: [],
  }

  render() {
    return (
      <Container fluid className="ratings">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main" style={{overflowX: 'hidden'}}>
              <div className="hashlog__main-title">
                <FormattedMessage
                  id="howitworks.title"
                  defaultMessage="Help"
                />
              </div>
              <div className="hashlog__main-board">
                <Row>
                  {this.state.links.map(({title, url}) => (
                    <Col xs="12" md="6" key={url} className="faq">
                      <ReactPlayer controls className="player" url={url} />
                      <h5>{title}</h5>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
