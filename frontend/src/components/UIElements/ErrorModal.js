import React from 'react';
import './ErrorModal.css'
import Modal from './Modal';


const ErrorModal = props => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<button onClick={props.onClear}>Okay</button>}
      footerClass = "error_footer"
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
