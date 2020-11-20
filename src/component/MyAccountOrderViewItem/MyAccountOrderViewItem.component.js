import { formatPrice } from '@6thstreetdotcom/algolia-sdk/app/utils/filters';
import {
    MyAccountReturnSuccessItem as SourceComponent
} from 'Component/MyAccountReturnSuccessItem/MyAccountReturnSuccessItem.component';

import './MyAccountOrderViewItem.style';

export class MyAccountOrderViewItem extends SourceComponent {
    renderDetails() {
        const {
            item: {
                name,
                color,
                price,
                original_price,
                size: { value: size = '' } = {},
                product_options: {
                    info_buyRequest: {
                        qty
                    }
                }
            } = {}
        } = this.props;

        // eslint-disable-next-line no-magic-numbers
        const discountPercentage = Math.round(100 * (1 - (price / original_price)));

        return (
            <div block="MyAccountReturnSuccessItem" elem="Details">
                <h2>{ name }</h2>
                <div block="MyAccountReturnSuccessItem" elem="DetailsOptions">
                    { !!color && (
                        <p>
                            { __('Color: ') }
                            <span>{ color }</span>
                        </p>
                    ) }
                    { !!qty && (
                        <p>
                            { __('Qty: ') }
                            <span>{ +qty }</span>
                        </p>
                    ) }
                    { !!size && (
                        <p>
                            { __('Size: ') }
                            <span>{ size }</span>
                        </p>
                    ) }
                </div>
                <p block="MyAccountReturnSuccessItem" elem="Price">
                    <span
                      block="MyAccountReturnSuccessItem"
                      elem="PriceRegular"
                      mods={ { isDiscount: !!(price < original_price) } }
                    >
                        { `${ formatPrice(+original_price) }` }
                    </span>
                    { !!(price < original_price) && (
                        <>
                            <span block="MyAccountReturnSuccessItem" elem="PriceDiscountPercent">
                                { `(-${discountPercentage}%)` }
                            </span>
                            <span block="MyAccountReturnSuccessItem" elem="PriceDiscount">
                                { `${ formatPrice(+price) }` }
                            </span>
                        </>
                    ) }
                </p>
            </div>
        );
    }

    render() {
        return (
            <div block="MyAccountOrderViewItem" mix={ { block: 'MyAccountReturnSuccessItem' } }>
                <div block="MyAccountReturnSuccessItem" elem="Content">
                    { this.renderImage() }
                    { this.renderDetails() }
                </div>
            </div>
        );
    }
}

export default MyAccountOrderViewItem;
