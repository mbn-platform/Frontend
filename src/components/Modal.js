import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

class ModalWindow extends React.Component {

  static propTypes = {
    afterOpenModal: PropTypes.func,
    modalIsOpen: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    afterOpenModal: () => null,
    modalIsOpen: false,
  };

  state = {
    //modalIsOpen: this.props.modalIsOpen
    modalIsOpen: true
  };


  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }


  render() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.props.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Example Modal"
      >
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 profit-block">
          <div className="card">
            <div className="card-header">
              <div className="container-fuild h-100">
                <div className="row h-100 align-items-center">
                  <div className="col-auto title-text">
              Тайтйл
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="container d-flex flex-column profit-card-body">
                <div className="row order-2 justify-content-center amcharts-block">
                  <div className="col-12">
                КОНТЕНТ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );}
}

export default ModalWindow;
