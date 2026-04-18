import React from 'react'
import ReactDOM from 'react-dom'

import classes from './Modal.module.css'

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick}></div>
}

const Modal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClick={props.onCloseOverlay} />,
        document.getElementById('backdrop')
      )}
      {ReactDOM.createPortal(
        <div className={`${classes.modal} ${props.className}`}>
          {props.children}
        </div>,
        document.getElementById('modal-overlay')
      )}
    </React.Fragment>
  )
}

export default Modal
