import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import "./CartCouponList.style";

export class CartCouponList extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
    handleApplyCode = (couponCode) => {
        this.props.applyCouponToCart(couponCode)
    }
    handleRemoveCode = (couponCode) => {
        this.props.removeCouponFromCart()
    }
    renderCouponItems() {
        const { couponLists = {} } = this.props;
        return Object.entries(couponLists).map(this.renderCouponItem);
    }
    renderCouponItem = ([key, coupon]) => {
        const {couponCode} = this.props;
        return (
            <div block="coupon-list">
                <div>
                    <p>{coupon.code}</p>
                    <p>{coupon.name}</p>
                    {couponCode === coupon.code ? <button onClick={() => { this.handleRemoveCode() }}>Remove</button> : <button onClick={() => { this.handleApplyCode(coupon.code) }}>apply</button>  }
                   
                    
                </div>
                <div>
                    <p>{coupon.code}</p>
                    <p>{coupon.name}</p>
                    <p>{coupon.description}</p>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div block="CouponLists">
                <h2>coupon list</h2>
                {this.renderCouponItems()}
            </div>
        )

    }
}

export default CartCouponList;