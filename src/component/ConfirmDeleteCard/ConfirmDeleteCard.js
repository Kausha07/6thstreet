import React from "react";
import "./ConfirmDeleteCard.style";
import ClickOutside from "Component/ClickOutside";

function ConfirmDeleteCard({
  closeremoveOosOverlay,
  isArabic,
  handleDeleteBtnConfirmClick,
}) {
  const onClickOutSide = () => {
    closeremoveOosOverlay(false);
  };

  return (
    <div block="deleteCardOverlayWrapper">
      <ClickOutside onClick={onClickOutSide}>
        <div block="removeOosOverlay" mods={{ isArabic }}>
          <div className="closebuttonDiv">
            <button
              onClick={(e) => {
                closeremoveOosOverlay(false);
              }}
              block="closePopupbtn"
              mods={{ isArabic }}
            >
              <span>Close</span>
            </button>
          </div>

          <div block="removeOssMessageWrapper">
            <p>{__("Are you sure you want to remove this card?")}</p>
          </div>

          <div block="removeOosButtonWrapper">
            <button
              block="removeOosButton"
              onClick={() => {
                onClickOutSide();
              }}
            >
              {__("Cancel")}
            </button>

            <button
              block="removeOosButton"
              onClick={() => {
                handleDeleteBtnConfirmClick();
                onClickOutSide();
              }}
            >
              {__("Yes")}
            </button>
          </div>
        </div>
      </ClickOutside>
    </div>
  );
}

export default ConfirmDeleteCard;
