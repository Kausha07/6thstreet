import React, { useEffect} from 'react'
import ReactDOM from 'react-dom';
import './ModalOverlay.style.scss';
import ModalPopup from "./ModalPopup";
import Backdrop from "./Backdrop";
import Event, {
    EVENT_PDP_CLOSE_POPUP,
    MOE_trackEvent
  } from "Util/Event";

const ModalOverlay = (props) => {

    useEffect(()=>{
        const eventData = {
            popup_name:props.popupName
        }
        if(props.open){
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
            /* MOE events */
            MOE_trackEvent(EVENT_PDP_CLOSE_POPUP,eventData);
        }
        return () => {
            document.body.classList.remove('modal-open');
            /* MOE events */
            MOE_trackEvent(EVENT_PDP_CLOSE_POPUP,eventData);
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