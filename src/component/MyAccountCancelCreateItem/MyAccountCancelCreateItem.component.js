import PropTypes from 'prop-types';
import {
    MyAccountReturnCreateItem as SourceComponent
} from 'Component/MyAccountReturnCreateItem/MyAccountReturnCreateItem.component';
import { CONST_HUNDRED } from 'Util/Common';

import { formatPrice } from '../../../packages/algolia-sdk/app/utils/filters';

export class MyAccountCancelCreateItem extends SourceComponent {
    static propTypes = {
        displayDiscountPercentage: PropTypes.bool.isRequired
    };

    static defaultProps = {
        displayDiscountPercentage: true
    };

    renderDetails() {
        const {
            displayDiscountPercentage,
            item: {
                name,
                color,
                price,
                original_price,
                size: sizeField,
                qty_ordered: qty
            }
        } = this.props;
        const size = (!!sizeField && typeof sizeField === 'object') ? sizeField.value : sizeField;

        return (
            <div block="MyAccountReturnCreateItem" elem="Details">
                <h2>{ name }</h2>
                <div block="MyAccountReturnCreateItem" elem="DetailsOptions">
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
                <p block="MyAccountReturnCreateItem" elem="Price">
                    <span
                      block="MyAccountReturnCreateItem"
                      elem="PriceRegular"
                      mods={ { isDiscount: (+price < +original_price) } }
                    >
                        { `${ formatPrice((+price < +original_price) ? original_price : price) }` }
                    </span>
                    { (+price < +original_price) && (
                        <>
                            {
                                displayDiscountPercentage &&
                                <span block="MyAccountReturnCreateItem" elem="PriceDiscountPercent">
                                    { `(-${ ((+price / +original_price) * CONST_HUNDRED).toFixed() }%)` }
                                </span>
                            }
                            <span block="MyAccountReturnCreateItem" elem="PriceDiscount">
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
            <div block="MyAccountReturnCreateItem">
                <div block="MyAccountReturnCreateItem" elem="Content">
                    { this.renderField() }
                    { this.renderImage() }
                    { this.renderDetails() }
                </div>
                <div block="MyAccountReturnCreateItem" elem="Resolution">
                    { this.renderReasons() }
                    { this.renderResolutions() }
                </div>
            </div>
        );
    }
}

export default MyAccountCancelCreateItem;
