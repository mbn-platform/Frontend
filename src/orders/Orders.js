import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';
import Controls from './Controls';
import OrdersTable from './OrdersTable';

class Orders extends React.Component {

  render() {
    return (
      <Container fluid className="orders">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus />
            <div className="orders-main">
              <div className="orders-main__top">
                <div className="row  align-items-center">
                  <div className="orders-main__title"> Orders</div>
                </div>
                <Controls />
              </div>
              <OrdersTable />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
  componentDidMount() {
    window.customize();
  }

  componentWillUnmount() {
    window.uncustomize();
  }
}

export default Orders;
