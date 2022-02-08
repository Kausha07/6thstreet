import { PureComponent } from "react";
import "./CartCouponDetail.style";

class CartCouponDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.couponDetailPopup = React.createRef();
    }
    
    componentDidMount() {
        window.addEventListener("mousedown", this.checkIfClickedOutside);
    }
    
    checkIfClickedOutside = e => {
        if (this.props.couponDetail.isCouponDetialPopupOpen && this.couponDetailPopup.current && !this.couponDetailPopup.current.contains(e.target)) {
            this.props.hideDetail(e);
            const bodyElt = document.querySelector("body");
            bodyElt.removeAttribute("style");
        }
    }
    


    render() {
        console.log(this.props)
        return (
            <div block="couponDetailPopup">
                <div block="couponDetailOverlay">
                    <div block="couponDetialPopupBlock" ref={this.couponDetailPopup}>                    
                        <p block="couponItemCode">{this.props.couponDetail.couponCode}</p>
                        <p block="couponItemName">{this.props.couponDetail.couponName}</p>
                        <p block="couponItemDes">{this.props.couponDetail.couponDescription}</p>
                    </div>
                </div>
                
            </div>
        )
    }
}

// export default CartCouponDetail;
export default CartCouponDetail;
