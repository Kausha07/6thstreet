import React, { useEffect} from 'react'
import ReactDOM from 'react-dom';
import './ModalOverlay.style.scss';
import ModalPopup from "./ModalPopup";
import Backdrop from "./Backdrop";

const ModalOverlay = (props) => {

    useEffect(()=>{
        if(props.open){
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
          document.body.classList.remove('modal-open');
        }
      },[props.open])
    
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