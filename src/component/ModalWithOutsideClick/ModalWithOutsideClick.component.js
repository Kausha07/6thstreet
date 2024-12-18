import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./ModalWithOutsideClick.style";

const ModalWithOutsideClick = ({ show, onClose, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (show) {
      document.body.classList.add("modalWithOutsideClick-open");
    }
    return () => {
      document.body.classList.remove("modalWithOutsideClick-open");
    };
  }, [show]);


  if (!show) {
    return null;
  }

  return (
    <>
      {ReactDOM.createPortal(
        <div
          className="modalWithOutsideClick-overlay"
          onClick={() => onClose()}
        ></div>,
        document.body
      )}
      {ReactDOM.createPortal(
        <div className="modalWithOutsideClick-content">{children}</div>,
        document.body
      )}
    </>
  );
};

export default ModalWithOutsideClick;
