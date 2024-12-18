import { PureComponent } from "react";
import "./CartCouponDetail.style";
import { isArabic } from "Util/App";

class CartCouponDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.couponDetailPopup = React.createRef();
    }
    
    state = {
        isArabic : isArabic(),
    }
    
    componentDidMount() {
        window.addEventListener("mousedown", this.checkIfClickedOutside);
    }
    
    checkIfClickedOutside = e => {
        if (this.props.couponDetail.isCouponDetialPopupOpen &&  !this.props.couponDetail.isTermsAndConditionspopupOpen && this.couponDetailPopup.current && !this.couponDetailPopup.current.contains(e.target)) {
            this.props.hideDetail(e);
            const bodyElt = document.querySelector("body");
            bodyElt.removeAttribute("style");
        }
    }
    
    hideCouponDetialPopup = (e) => {
        e.stopPropagation()
        this.props.hideDetail(e);
        if (!this.props.isCouponPopupOpen) {
          const bodyElt = document.querySelector("body");
          bodyElt.removeAttribute("style");
        }
      }


    render() {
        const { isArabic } = this.state;

        return (
            <div block="couponDetailPopup">
                <div block="couponDetailOverlay">
                    <div block="couponDetialPopupBlock" ref={this.couponDetailPopup}>                    
                        <p block="couponItemCode">
                            {this.props.couponDetail.couponCode}
                            <button onClick={(e)=>{this.hideCouponDetialPopup(e)}} block="closePopupbtn" mods={{isArabic}}><span>Close</span></button>
                        </p>
                        <p block="couponItemName">{this.props.couponDetail.couponName}</p>
                        <p block="couponItemDes">{this.props.couponDetail.couponDescription}</p>

                        {
                            this.props.couponDetail.TermsAndConditions === "" ?
                                (null) :
                                (
                                <p block="couponItemDesLinkP">
                                    <a block="couponItemDesLink" 
                                        onClick={(e) => { this.props.showTermsAndConditions(e) }}
                                    >
                                            {__("Terms & Conditions")}
                                    </a>
                                </p>
                                )
                        }
                    </div>
                </div>
                
            </div>
        )
    }
}

// export default CartCouponDetail;
export default CartCouponDetail;
