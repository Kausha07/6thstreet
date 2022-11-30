import { PureComponent } from "react";
import "./CartCouponTermsAndConditions.style.scss";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";

class CartCouponTermsAndConditions extends PureComponent {

    constructor(props) {
        super(props);
        this.couponTermsAndConditionsPopupRef = React.createRef();
    }

    state = {
        isArabic : isArabic(),
        isMobile: isMobile.any() || isMobile.tablet(),
    }

    componentDidMount() {
        window.addEventListener("mousedown", this.checkIfClickedOutsideTermsAndConditions);
    }

    checkIfClickedOutsideTermsAndConditions = e => {
        if (this.props.TermsAndConditions.isTermsAndConditionspopupOpen && this.couponTermsAndConditionsPopupRef.current && !this.couponTermsAndConditionsPopupRef.current.contains(e.target)) {
            this.props.hideTermsAndConditions(e);
            const bodyElt = document.querySelector("body");
            bodyElt.removeAttribute("style");
        }
    }

    couponTermsAndConditionsPopup = (e) => {
        e.stopPropagation()
        this.props.hideTermsAndConditions(e);
      }

    render() {
        const { isArabic, isMobile } = this.state;

        return (
            <div block="couponTermsAndConditionsPopup">
                <div block="couponTermsAndConditionsOverlay">
                    <div block="couponTermsAndConditionsPopupBlock" ref={this.couponTermsAndConditionsPopupRef}>                    
                        <div block="couponTermsAndConditionsPopupTitlesWrapper">
                            <h2 block="couponTermsAndConditionsPopupTitles">
                                {__("Terms & Conditions")}
                            </h2>
                        </div>
                        <p block="couponItemTermsAndConditionsDes">{this.props.TermsAndConditions.TermsAndConditions} </p>
                        <div block="couponTermsAndConditionsPopupIAgreeButtonWrapper">
                            <button onClick={(e)=>{this.couponTermsAndConditionsPopup(e)}} block="couponTermsAndConditionsPopupIAgreeButton"
                            >
                                {__("I Agree")}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default CartCouponTermsAndConditions;