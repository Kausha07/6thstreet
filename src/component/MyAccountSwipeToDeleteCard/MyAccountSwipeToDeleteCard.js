import React, { useRef, useState } from "react";
import "./MyAccountSwipeToDeleteCard.style";
import crossIcon from "Component/CreditCard/icons/crossIcon.svg";
import trash from "./trash.svg";
import Image from "Component/Image";
import { MINI_CARDS } from "Component/CreditCard/CreditCard.config";
import ConfirmDeleteCard from "Component/ConfirmDeleteCard/ConfirmDeleteCard";

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

    const el = ref.current;
    el?.classList?.add("isActive");
  };

  const onPointerUp = (e) => {
    e.stopPropagation();
    ref.current.removeEventListener("pointermove", onPointerMove);

    const el = ref.current;
    el?.classList?.remove("isActive");
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

const handleSwipeRemoveItem = (handleDeleteBtnClick) => {
  return (
    <div block="deleteActionItem">
      <button
        block="deleteActionItem"
        name="RemoveItem"
        elem="delete"
        aria-label="Remove expired card"
        onClick={() => handleDeleteBtnClick()}
      >
        <img src={trash} alt="trash" />
        <span block="deleteActionItem" elem="title">
          {__("Delete")}
        </span>
      </button>
    </div>
  );
};

const renderConfirmDeleteCard = (
  isArabic,
  closeremoveOosOverlay,
  handleDeleteBtnConfirmClick
) => {
  return (
    <ConfirmDeleteCard
      isArabic={isArabic}
      closeremoveOosOverlay={closeremoveOosOverlay}
      handleDeleteBtnConfirmClick={handleDeleteBtnConfirmClick}
    />
  );
};

export const MyAccountSwipeToDeleteCard = (props) => {
  const { item, renderMiniCard, deleteCreditCard, isArabic } = props;
  const { entity_id, selected, details, expires_at, gateway_token } = item;
  const { maskedCC, bin = "000000", expirationDate, scheme = "" } = details;
  let cardNum = `${bin.substr(0, 4)} **** **** ${maskedCC}`;

  const [isSwiping, setIsSwiping] = useState(false);
  const [isConfirmDeletePopup, setIsConfirmDeletePopup] = useState(false);

  const { visa, mastercard, amex } = MINI_CARDS;

  let miniCardImg;
  switch (scheme.toLowerCase()) {
    case "visa":
      miniCardImg = visa;
      break;
    case "mastercard":
      miniCardImg = mastercard;
      break;
    default:
      miniCardImg = amex;
      break;
  }

  const handleButtonClick = () => {
    setIsSwiping(!isSwiping);
  };

  const handleDeleteBtnClick = () => {
    setIsConfirmDeletePopup(true);
  };

  const handleDeleteBtnConfirmClick = () => {
    deleteCreditCard ? deleteCreditCard(gateway_token) : null;
  };

  const closeremoveOosOverlay = (currentState) => {
    setIsConfirmDeletePopup(currentState);
  };

  return (
    <>
      <div block="wrapperSwipeToDelete" mods={{ isArabic }}>
        <Item isSwiping={isSwiping} isArabic={isArabic}>
          <div className="contentWrapper">
            <div block="MyAccountPaymentCard">
              <div block="MyAccountPaymentCard" elem="DetailWrapper">
                <div>
                  <Image
                    lazyLoad={true}
                    src={miniCardImg}
                    mix={{
                      block: "MyAccountPaymentCard",
                      elem: "Picture",
                      mods: { isArabic },
                    }}
                    ratio="custom"
                    alt={scheme}
                  />
                </div>
                <div block="MyAccountPaymentCard" elem="DetailBlock">
                  <div block="MyAccountPaymentCard" elem="cardNum">
                    {cardNum}
                  </div>

                  <div block="MyAccountPaymentCard" elem="ExpDate">
                    Exp:{" "}
                    {`${expirationDate.substr(0, 3)}${expirationDate.substr(
                      5,
                      2
                    )}`}
                  </div>
                </div>
              </div>
              <div block="MyAccountPaymentCard" elem="DetailWrapper">
                <div block="MyAccountPaymentCard" elem="DetailBlock">
                  <img
                    src={crossIcon}
                    onClick={() => {
                      handleButtonClick();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div block="DeleteButton" mods={{ isArabic }}>
            {handleSwipeRemoveItem(handleDeleteBtnClick)}
          </div>
        </Item>
      </div>
      {isConfirmDeletePopup
        ? renderConfirmDeleteCard(
            isArabic,
            closeremoveOosOverlay,
            handleDeleteBtnConfirmClick
          )
        : null}
    </>
  );
};

export default MyAccountSwipeToDeleteCard;
