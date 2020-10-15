import PropTypes from 'prop-types';

import { formatPrice } from '@6thstreetdotcom/algolia-sdk/app/utils/filters';
import { MyAccountReturnCreateItem } from 'Component/MyAccountReturnCreateItem/MyAccountReturnCreateItem.component';

import './MyAccountReturnSuccessItem.style';

export class MyAccountReturnSuccessItem extends MyAccountReturnCreateItem {
    static propTypes = {
        item: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            thumbnail: PropTypes.string,
            color: PropTypes.string,
            price: PropTypes.string,
            original_price: PropTypes.string,
            qty_requested: PropTypes.number,
            size: PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string
            })
        }).isRequired
    };

    renderDetails() {
        const {
            item: {
                name,
                color,
                price,
                original_price,
                size,
                qty_requested: qty
            } = {}
        } = this.props;

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
                                { `(-${ (+price / +original_price).toFixed() }%)` }
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
            <div block="MyAccountReturnSuccessItem">
                <p>{ __('Item details') }</p>
                <div block="MyAccountReturnSuccessItem" elem="Content">
                    { this.renderImage() }
                    { this.renderDetails() }
                </div>
            </div>
        );
    }
}

export default MyAccountReturnSuccessItem;
