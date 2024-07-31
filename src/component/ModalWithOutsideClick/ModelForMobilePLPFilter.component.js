import ModalWithOutsideClick from "Component/ModalWithOutsideClick";
import { ChevronLeft } from "Component/Icons";
import MyAccountAddressPopup from "Component/MyAccountAddressPopup";
import MyAccountDispatcher from "Store/MyAccount/MyAccount.dispatcher";
import { hideActiveOverlay } from "Store/Overlay/Overlay.action";
import { connect } from "react-redux";
import isMobile from "Util/Mobile";

export const mapStateToProps = (state) => ({
  isExpressPopUpOpen: state.MyAccountReducer.isExpressPopUpOpen,
  isExpressPLPAddressOpen: state.MyAccountReducer.isExpressPLPAddressOpen,
  customer: state.MyAccountReducer.customer,
});

export const mapDispatchToProps = (_dispatch) => ({
  expressPopUpOpen: (val) =>
    MyAccountDispatcher.expressPopUpOpen(_dispatch, val),
  setExpressPLPAddressForm: (val) =>
    MyAccountDispatcher.setExpressPLPAddressForm(_dispatch, val),
  hideActiveOverlay: () => {
    _dispatch(hideActiveOverlay());
  },
});

const ModelForMobilePLPFilter = (props) => {
  const closeExpressAddressPopUp = () => {
    props.hideActiveOverlay();
    props.setExpressPLPAddressForm(false);
    props.expressPopUpOpen(false);
  };

  return (
    <>
      {props.isExpressPopUpOpen &&
        props.isExpressPLPAddressOpen &&
        isMobile.any() && (
          <ModalWithOutsideClick
            show={props.isExpressPLPAddressOpen}
            onClose={() => props.setExpressPLPAddressForm(false)}
          >
            <div
              block="MyAccountAddressBook-Express"
              elem="ContentWrapper"
              mods={{}}
            >
              <span
                onClick={() => closeExpressAddressPopUp()}
                block="popUpBackArrow"
              >
                {" "}
                <ChevronLeft
                  style={{
                    position: "fixed",
                    top: "30px",
                    left: "10px",
                    zIndex: "99999",
                    width: "20px",
                    height: "30px",
                  }}
                />
              </span>
              <MyAccountAddressPopup
                formContent={true}
                closeForm={() => props.expressPopUpOpen(false)}
                openForm={() => true}
                showCards={false}
                customer={props.customer}
              />{" "}
            </div>
          </ModalWithOutsideClick>
        )}
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelForMobilePLPFilter);
