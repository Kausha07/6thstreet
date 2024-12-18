import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import "./CartCouponList.style";
import { isArabic } from 'Util/App';
import CartCouponDetail from 'Component/CartCouponDetail'
import Loader from "Component/Loader";
import Event, {
    EVENT_APPLY_COUPON_FAILED,
    EVENT_APPLY_COUPON,
    EVENT_GTM_COUPON,
    MOE_trackEvent
  } from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
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
                this.sendEvents(EVENT_APPLY_COUPON, couponCode);        
            }else{
                this.sendEvents(EVENT_APPLY_COUPON_FAILED, couponCode);
            }
            if(setLoader) {
                setLoader(false)
            }else {
                this.setState({isLoading:false});
            }
        }
        catch(error){
            console.error(error);
            this.sendEvents(EVENT_APPLY_COUPON_FAILED, couponCode);
        }
        
    }
    handleRemoveCode = (couponCode) => {
        this.props.removeCouponFromCart()
    }

    sendEvents(event, coupon) {
        MOE_trackEvent(event, {
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          coupon_code: coupon || "",
          app6thstreet_platform: "Web",
        });
        const eventData = {
            name: event,
            coupon: coupon,
            discount: this.props?.totals?.discount || "",
            shipping: this.props?.totals?.shipping_fee || "",
            tax: this.props?.totals?.tax_amount || "",
            sub_total : this.props?.totals?.subtotal || "",
            subtotal_incl_tax : this.props?.totals?.subtotal_incl_tax || "",
            total: this.props?.totals?.total || "",
          };
        Event.dispatch(EVENT_GTM_COUPON, eventData);
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