import React from 'react';
import './ErrorModal.css'
import Modal from './Modal';


const SuccessModal = props => {
  return (
    <Modal
      onCancel={props.onRedirect}
      header="Success!"
      show={!!props.success}
      footer={<button onClick={props.onRedirect}>Okay</button>}
      footerClass = "error_footer"
    >
      <p>{props.success}</p>
    </Modal>
  );
};

export default SuccessModal;
