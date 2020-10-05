/* eslint-disable react/jsx-one-expression-per-line */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import CartItemPrice from 'Component/CartItemPrice';
import Image from 'Component/Image';
import Link from 'Component/Link';
import Loader from 'Component/Loader';
import { CartItemType } from 'Type/MiniCart';
import { isArabic } from 'Util/App';

import './CartItem.extended.style';

/**
 * Cart and CartOverlay item
 * @class CartItem
 */
export class CartItem extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        item: CartItemType.isRequired,
        currency_code: PropTypes.string.isRequired,
        isEditing: PropTypes.bool,
        isLikeTable: PropTypes.bool,
        handleRemoveItem: PropTypes.func.isRequired,
        minSaleQuantity: PropTypes.number.isRequired,
        maxSaleQuantity: PropTypes.number.isRequired,
        handleChangeQuantity: PropTypes.func.isRequired,
        getCurrentProduct: PropTypes.func.isRequired,
        linkTo: PropTypes.oneOfType([
            PropTypes.shape({
                pathname: PropTypes.string,
                search: PropTypes.string
            }),
            PropTypes.string
        ]).isRequired,
        thumbnail: PropTypes.string.isRequired
    };

    static defaultProps = {
        isEditing: false,
        isLikeTable: false
    };

    state = {
        isArabic: isArabic()
    };

    renderProductConfigurationOption = ([key, attribute]) => {
        const {
            item: {
                product: {
                    configurable_options
                }
            }
        } = this.props;

        const { attribute_code, attribute_value } = attribute;

        if (!Object.keys(configurable_options).includes(key)) {
            return null;
        }

        const {
            [attribute_code]: { // configurable option attribute
                attribute_options: {
                    [attribute_value]: { // attribute option value label
                        label
                    }
                }
            }
        } = configurable_options;

        return (
            <li
              key={ attribute_code }
              aria-label={ attribute_code }
              block="CartItem"
              elem="Option"
            >
                { label }
            </li>
        );
    };

    renderProductConfigurations() {
        const {
            item: {
                product: {
                    configurable_options,
                    variants
                }
            },
            isLikeTable,
            getCurrentProduct
        } = this.props;

        if (!variants || !configurable_options) {
            return null;
        }

        const { attributes = [] } = getCurrentProduct() || {};

        if (!Object.entries(attributes).length) {
            return null;
        }

        return (
            <ul
              block="CartItem"
              elem="Options"
              mods={ { isLikeTable } }
            >
                { Object.entries(attributes).map(this.renderProductConfigurationOption) }
            </ul>
        );
    }

    renderWrapper() {
        const { linkTo } = this.props;

        // TODO: implement shared-transition here?

        return (
            <Link to={ linkTo } block="CartItem" elem="Link">
                <figure block="CartItem" elem="Wrapper">
                    { this.renderImage() }
                    { this.renderContent() }
                </figure>
            </Link>
        );
    }

    renderProductOptionValue = (optionValue, i, array) => {
        const { label, value } = optionValue;
        const isNextAvailable = Boolean(array[i + 1]);

        return (
            <span
              block="CartItem"
              elem="ItemOptionValue"
              key={ label }
            >
                { label || value }{ isNextAvailable && ', ' }
            </span>
        );
    };

    renderProductOption = (option) => {
        const { label, values, id } = option;

        return (
            <div
              block="CartItem"
              elem="ItemOption"
              key={ id }
            >
                <div
                  block="CartItem"
                  elem="ItemOptionLabel"
                  key={ `label-${ id }` }
                >
                    { `${ label }:` }
                </div>
                <div block="CartItem" elem="ItemOptionValues">
                    { values.map(this.renderProductOptionValue) }
                </div>
            </div>
        );
    };

    renderProductOptions(itemOptions = []) {
        const { isLikeTable } = this.props;

        if (!itemOptions.length) {
            return null;
        }

        return (
            <div
              block="CartItem"
              elem="ItemOptionsWrapper"
              mods={ { isLikeTable } }
            >
                { itemOptions.map(this.renderProductOption) }
            </div>
        );
    }

    renderProductName() {
        const name = 'R&M';
        const color = 'Yellow';
        const size = 'XL';
        const qty = '1';
        const {
            isArabic
        } = this.state;

        return (
            <p
              block="CartItem"
              elem="Heading"
              mods={ { isArabic } }
            >
                <h2> { name } </h2>
                <span> { color }  </span>
                <span> Size: <text>{ size } </text></span>
                <span> Qty: <text>{ qty } </text></span>
            </p>
        );
    }

    renderProductPrice() {
        const {
            isLikeTable,
            currency_code,
            item: {
                row_total
            }
        } = this.props;

        return (
            <CartItemPrice
              row_total={ row_total }
              currency_code={ currency_code }
              mix={ {
                  block: 'CartItem',
                  elem: 'Price',
                  mods: { isLikeTable }
              } }
            />
        );
    }

    renderContent() {
        const {
            isLikeTable,
            item: {
                customizable_options,
                bundle_options
            }
        } = this.props;

        return (
            <figcaption
              block="CartItem"
              elem="Content"
              mods={ { isLikeTable } }
            >
                { this.renderProductName() }
                { this.renderProductOptions(customizable_options) }
                { this.renderProductOptions(bundle_options) }
                { this.renderProductConfigurations() }
                { this.renderProductPrice() }
            </figcaption>
        );
    }

    renderImage() {
        const { item: { product: { name } }, thumbnail } = this.props;

        return (
            <>
                <Image
                  src={ thumbnail }
                  mix={ {
                      block: 'CartItem',
                      elem: 'Picture'
                  } }
                  ratio="custom"
                  alt={ `Product ${name} thumbnail.` }
                />
                <img
                  style={ { display: 'none' } }
                  alt={ name }
                  src={ thumbnail }
                />
            </>
        );
    }

    render() {
        const { isLoading } = this.props;

        return (
            <div block="CartItem">
                <Loader isLoading={ isLoading } />
                { this.renderWrapper() }
            </div>
        );
    }
}

export default CartItem;
