import React from 'react'
import ReactDOM from 'react-dom';
import './ModalOverlay.style.scss';
import ModalPopup from "./ModalPopup";
import Backdrop from "./Backdrop";

const ModalOverlay = (props) => {
    
    return (
        <>
            {ReactDOM.createPortal(
                <Backdrop onConfirm={props.onConfirm} />, document.querySelector('body')
            )}
            {
                ReactDOM.createPortal(<ModalPopup className={`${props.className}`} open={props.open} onConfirm={props.onConfirm}>{props.children}</ModalPopup>,document.querySelector('body'))
            }

        </>
    )
}

export default ModalOverlay;