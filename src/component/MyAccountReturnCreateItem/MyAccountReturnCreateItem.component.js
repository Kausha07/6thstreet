import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { formatPrice } from '@6thstreetdotcom/algolia-sdk/app/utils/filters';
import Field from 'Component/Field';
import Image from 'Component/Image';

import './MyAccountReturnCreateItem.style';

class MyAccountReturnCreateItem extends PureComponent {
    static propTypes = {
        isSelected: PropTypes.bool.isRequired,
        onResolutionChange: PropTypes.func.isRequired,
        resolutionOptions: PropTypes.array.isRequired,
        onClick: PropTypes.func.isRequired,
        item: PropTypes.shape({
            item_id: PropTypes.string,
            name: PropTypes.string,
            thumbnail: PropTypes.string,
            color: PropTypes.string,
            row_total: PropTypes.string,
            discount_percent: PropTypes.string,
            discount_amount: PropTypes.string,
            product_options: PropTypes.shape({
                info_buyRequest: PropTypes.shape({
                    qty: PropTypes.string
                })
            }),
            size: PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string
            })
        }).isRequired
    };

    renderResolution() {
        const { item: { item_id }, isSelected } = this.props;
        const { onResolutionChange, resolutionOptions } = this.props;

        if (!isSelected) {
            return null;
        }

        return (
            <Field
              type="select"
              id={ `${item_id}_resolution` }
              name={ `${item_id}_resolution` }
              placeholder={ __('Select a resolution') }
              mix={ { block: 'MyAccountReturnCreateItem', elem: 'Resolution' } }
              onChange={ onResolutionChange }
              selectOptions={ resolutionOptions }
            />
        );
    }

    renderImage() {
        const { item: { thumbnail } } = this.props;

        return (
            <Image
              src={ thumbnail }
              mix={ { block: 'MyAccountReturnCreateItem', elem: 'Image' } }
            />
        );
    }

    renderField() {
        const { item: { item_id } } = this.props;
        const { onClick } = this.props;

        return (
            <Field
              id={ item_id }
              name={ item_id }
              value={ item_id }
              mix={ { block: 'MyAccountReturnCreateItem', elem: 'Checkbox' } }
              type="checkbox"
              onClick={ onClick }
              defaultChecked={ false }
            />
        );
    }

    renderDetails() {
        const {
            item: {
                name,
                color,
                row_total,
                discount_percent,
                discount_amount,
                size: { value: size },
                product_options: { info_buyRequest: { qty } }
            }
        } = this.props;

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
                      mods={ { isDiscount: (!!(+discount_amount) && !!(+discount_percent)) } }
                    >
                        { `${ formatPrice(+row_total) }` }
                    </span>
                    { (!!(+discount_amount) && !!(+discount_percent)) && (
                        <>
                            <span block="MyAccountReturnCreateItem" elem="PriceDiscountPercent">
                                { `(-${ +discount_percent }%)` }
                            </span>
                            <span block="MyAccountReturnCreateItem" elem="PriceDiscount">
                                { `${ formatPrice(+discount_amount) }` }
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
                { this.renderResolution() }
            </div>
        );
    }
}

export default MyAccountReturnCreateItem;
