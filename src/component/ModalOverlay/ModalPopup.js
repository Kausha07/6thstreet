import close from '.icons/close.svg';
import { isArabic } from "Util/App";

const ModalPopup = (props) => {
    return (
      <div className={`modal ${isArabic() ? '_isArabic':''}  ${props.className} ${props.open ? 'active':''}`}>
        
          {props.children}

          <button block='modal-close' onClick={props.onConfirm} mods={{isArabic : isArabic() }}>
            <img block='modal-close' elem='icon' src={close} alt="close" />
            <span block='modal-close' elem='text'>close</span>
          </button>
        
      </div>
    );
  }
  export default ModalPopup;