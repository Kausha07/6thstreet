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

  useEffect(() => {
    window.addEventListener("mousedown", closePopupOnOutsideClick);
    return () => {
      window.removeEventListener("mousedown", closePopupOnOutsideClick);
    };
  }, []);

  const closePopupOnOutsideClick = (e) => {
    if (show && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modalWithOutsideClick-overlay">
      <div className="modalWithOutsideClick-content" ref={modalRef}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalWithOutsideClick;
