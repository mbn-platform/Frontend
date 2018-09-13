import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

class ModalWindow extends React.Component {

  static propTypes = {
    content: PropTypes.any.isRequired,
    title: PropTypes.any,
    afterOpenModal: PropTypes.func,
    onClose: PropTypes.func,
    modalIsOpen: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    afterOpenModal: () => null,
    title: '',
    modalIsOpen: false,
  };

  state = {
    modalIsOpen: this.props.modalIsOpen
  };

  static getDerivedStateFromProps(props, state) {
    if (state.modalIsOpen !== props.modalIsOpen) {
      return {modalIsOpen: props.modalIsOpen};
    }
    return null;
  }

  render() {
    const { title, content, afterOpenModal, onClose } = this.props;
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={onClose}
        ariaHideApp={false}
        className="modal__main"
        style={{
          overlay: {
            zIndex: '100000',
            background: 'rgba(0,0,0,.6)',
            border: 0,
          },
          content: {
            border: 0,
            background: 'none',
          },
        }}
        contentLabel="Example Modal"
      >
        <div className="col-12 col-sm-12 col-md-12 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6 profit-block">
          <div className="modal__container">
            <div className="modal__header">
              <div className="container-fuild h-100">
                <div className="row h-100 align-items-center">
                  <div className="col-auto modal__title">
                    { title }
                  </div>
                </div>
              </div>
              <div className="modal__close" onClick={() => onClose()}/>
            </div>
            <div className="modal__body">
              <div className="container d-flex flex-column ">
                <div className="row order-2 justify-content-center">
                  <div className="col-12 modal__content">
                    {content}
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
