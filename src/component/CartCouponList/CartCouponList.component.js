import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import "./CartCouponList.style";
import { isArabic } from 'Util/App';
import CartCouponDetail from 'Component/CartCouponDetail'
import Loader from "Component/Loader";
export class CartCouponList extends PureComponent {
    constructor(props) {
        super(props);
    }
    state= {
        isLoading : false,
    }

    handleApplyCode = async (couponCode) => {
        const { setLoader } = this.props
        if(setLoader) {
            setLoader(true)
        }else {
            this.setState({isLoading:true});
        }
        try{            
            let apiResponse = await (this.props.applyCouponToCart(couponCode)) || null;
            if (typeof apiResponse !== "string") {
                this.props.closePopup();
            }
            if(setLoader) {
                setLoader(false)
            }else {
                this.setState({isLoading:false});
            }
        }
        catch(error){
            console.error(error);
        }
        
    }
    handleRemoveCode = (couponCode) => {
        this.props.removeCouponFromCart()
    }
    
    
    renderCouponItems() {
        const { couponLists = {} } = this.props;
        return Object.entries(couponLists).map(this.renderCouponItem);
    }
    renderCouponItem = ([key, coupon]) => {
        const { couponCode } = this.props;

        return (
            <li block="couponListItem" key={key}>
                <div block="couponItemBlock">
                    <div block="couponItemDetail">
                        <p block="couponItemCode">{coupon.code}</p>
                        <p block="couponItemName">{coupon.name}</p>
                        <button block="couponItemViewBtn" onClick={(e) => { this.props.showDetail(e, coupon) }}>{__("View Detail")}</button>
                    </div>                   
                    {couponCode === coupon.code ? 
                    <button onClick={() => { this.handleRemoveCode() }} block="couponItemBtn remove">{__("Remove")}</button>
                     : 
                    <button onClick={() => { this.handleApplyCode(coupon.code) }} block="couponItemBtn apply">{__("Apply")}</button>}
                </div>
            </li>
        )
    }
    render() {
        const { isLoading } = this.state;
        return (
            <>
                <ul block="CouponLists">
                    {this.renderCouponItems()}
                    <Loader isLoading={isLoading} />
                </ul>
                
            </>
        )

    }
}

export default CartCouponList;