import React, { useRef, useState } from "react";
import "./CreditCardSwipeToDelete.style";
import crossIcon from "Component/CreditCard/icons/crossIcon.svg";
import trash from "./trash.png";

const Item = ({ children, isSwiping, isArabic }) => {
  const ref = useRef();
  let downX;

  const onPointerMove = (e) => {
    e.stopPropagation();
    const newX = e.clientX;

    if (isArabic) {
      if (downX - newX < -30) {
        ref.current.style.transform = "translate(65px)";
        ref.current.classList.add("swipedCard");
      } else {
        ref.current.style.transform = "translate(0px)";
        ref.current.classList.remove("swipedCard");
      }
    } else {
      if (newX - downX < -30) {
        ref.current.style.transform = "translate(-65px)";
        ref.current.classList.add("swipedCard");
      } else {
        ref.current.style.transform = "translate(0px)";
        ref.current.classList.remove("swipedCard");
      }
    }
  };

  const onPointerDown = (e) => {
    e.stopPropagation();
    downX = e.clientX;
    ref.current.addEventListener("pointermove", onPointerMove);
  };

  const onPointerUp = (e) => {
    e.stopPropagation();
    ref.current.removeEventListener("pointermove", onPointerMove);
  };

  return (
    <div
      className={`ItemWrapper ${isSwiping ? "swipedCard" : ""}`}
      onPointerDown={onPointerDown}
      ref={ref}
      onPointerUp={onPointerUp}
      style={{
        transform: isSwiping
          ? isArabic
            ? "translate(65px)"
            : "translate(-65px)"
          : "translate(0px)",
      }}
    >
      {children}
    </div>
  );
};

const HandleSwipeRemoveItem = ({ handleDeleteBtnClick }) => {
  const onHandleClick = (e) => {
    e.stopPropagation();
    handleDeleteBtnClick();
  };
  return (
    <div block="cardDeleteActionItem">
      <div
        block="cardDeleteActionItem"
        name="RemoveItem"
        elem="delete"
        aria-label="Remove expired card"
        onClick={(e) => {
          onHandleClick(e);
        }}
      >
        <div block="cardDeleteActionItem" elem="imgWrapper">
          <img src={trash} alt="trash" />
        </div>
        <span block="cardDeleteActionItem" elem="title">
          {__("Delete")}
        </span>
      </div>
    </div>
  );
};

export const CreditCardSwipeToDelete = (props) => {
  const { item, renderMiniCard, deleteCreditCard, isArabic } = props;
  const { entity_id, selected, details, expires_at, gateway_token } = item;
  const { maskedCC, bin = "000000", expirationDate, scheme = "" } = details;
  let cardNum = `${bin.substr(0, 4)} **** **** ${maskedCC}`;

  const [isSwiping, setIsSwiping] = useState(false);

  const handleButtonClick = () => {
    setIsSwiping(!isSwiping);
  };

  const handleDeleteBtnClick = () => {
    deleteCreditCard(gateway_token);
  };

  return (
    <div block="wrapperSwipeToDelete" mods={{ isArabic }}>
      <Item isSwiping={isSwiping} isArabic={isArabic}>
        <div className="contentWrapper">
          <div block="expiredSavedCard" elem="Item" key={entity_id}>
            <div
              block="expiredSavedCard"
              elem="expiredText"
              mods={{ isArabic }}
            >
              <span>{__("Card Expired")}</span>
              <img
                onClick={() => {
                  handleButtonClick();
                }}
                src={crossIcon}
                block="expiredSavedCard"
                elem="expiredCross"
              />
            </div>

            <span block="expiredSavedCard" elem="CardNumber">
              {cardNum}
            </span>
            <div block="expiredSavedCard" elem="CvvImgCon">
              <span>
                {`${expirationDate.substr(0, 3)}${expirationDate.substr(5, 2)}`}
              </span>
              {renderMiniCard(scheme.toLowerCase())}
            </div>
          </div>
        </div>
        <div block="DeleteButton" mods={{ isArabic }}>
          {
            <HandleSwipeRemoveItem
              handleDeleteBtnClick={handleDeleteBtnClick}
            />
          }
        </div>
      </Item>
    </div>
  );
};

export default CreditCardSwipeToDelete;
