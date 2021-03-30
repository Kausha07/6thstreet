/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Product } from 'Util/API/endpoint/Product/Product.type';
import isMobile from 'Util/Mobile';

import PDPSizeGuide from '../PDPSizeGuide';

import './PDPAddToCart.style';

class PDPAddToCart extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        onSizeTypeSelect: PropTypes.func.isRequired,
        onSizeSelect: PropTypes.func.isRequired,
        addToCart: PropTypes.func.isRequired,
        sizeObject: PropTypes.object.isRequired,
        selectedSizeType: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        addedToCart: PropTypes.bool.isRequired,
        showProceedToCheckout: PropTypes.bool.isRequired,
        hideCheckoutBlock: PropTypes.bool.isRequired,
        processingRequest: PropTypes.bool.isRequired,
        routeChangeToCart: PropTypes.func.isRequired,
        setStockAvailability: PropTypes.func.isRequired
    };

    state = {
        isIPhoneNavigationHidden: false,
        pageYOffset: window.innerHeight,
        isRoundedIphone: this.isRoundedIphoneScreen() ?? false
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleResize);
    }

    isRoundedIphoneScreen() {
        return window.navigator.userAgent.match(/iPhone/) && window.outerHeight > '800';
    }

    handleResize = () => {
        const { pageYOffset, isRoundedIphone } = this.state;

        this.setState({
            isIPhoneNavigationHidden: isRoundedIphone && window.pageYOffset > pageYOffset,
            pageYOffset: window.pageYOffset
        });
    };

    getSizeTypeSelect() {
        const { sizeObject = {} } = this.props;

        if (sizeObject.sizeTypes !== undefined) {
            const listItems = sizeObject.sizeTypes.map((type = '') => (
                    <option
                      key={ type }
                      block="PDPAddToCart"
                      elem="SizeTypeOption"
                      value={ type }
                    >
                        { type.toUpperCase() }
                    </option>
            ));

            return listItems;
        }

        return null;
    }

    renderSizeAndOnQunatityBasedMessage(code) {
        const {
            product: { simple_products }, selectedSizeType
        } = this.props;

        const size = simple_products[code].size[selectedSizeType];

        switch (simple_products[code].quantity) {
        case '0':
            return (`${size} - ${__('Out of stock')}`);
        case '1':
            return (`${size} - ${__('1 left in stock')}`);
        case '2' || '3':
            return (`${size} - ${__('low stock')}`);
        default:
            return size;
        }
    }

    renderSizeOption(simple_products, code, label) {
        return (
            <option
              key={ code }
              block="PDPAddToCart"
              elem="SizeOption"
              value={ code }
              disabled={ simple_products[code].quantity === '0' }
            >
                { label }
            </option>
        );
    }

    getSizeSelect() {
        const {
            product: { simple_products }, product, selectedSizeType, sizeObject = {}
        } = this.props;

        if (sizeObject.sizeCodes !== undefined
            && simple_products !== undefined
            && product[`size_${selectedSizeType}`].length !== 0
        ) {
            return sizeObject.sizeCodes.reduce((acc, code) => {
                const label = this.renderSizeAndOnQunatityBasedMessage(code);

                if (label) {
                    acc.push(this.renderSizeOption(simple_products, code, label));
                }

                return acc;
            }, []);
        }

        return null;
    }

    renderSizeInfo() {
        const { sizeObject } = this.props;

        if ((sizeObject.sizeTypes !== undefined)
        && (sizeObject.sizeTypes.length !== 0)) {
            return (
                <div block="PDPAddToCart" elem="SizeInfo">
                    <span block="PDPAddToCart" elem="SizeLabel">{ __('Size:') }</span>
                    <PDPSizeGuide />
                </div>
            );
        }

        return null;
    }

    renderSizeTypeSelect() {
        const {
            onSizeTypeSelect, sizeObject
        } = this.props;

        if ((sizeObject.sizeTypes !== undefined)
        && (sizeObject.sizeTypes.length !== 0)) {
            return (
                <div block="PDPAddToCart" elem="SizeTypeSelector">
                    <select
                      key="SizeTypeSelect"
                      block="PDPAddToCart"
                      elem="SizeTypeSelectElement"
                      onChange={ onSizeTypeSelect }
                    >
                        { this.getSizeTypeSelect() }
                    </select>
                </div>
            );
        }

        return null;
    }

    renderSizeSelect() {
        const {
            onSizeSelect, sizeObject
        } = this.props;

        if ((sizeObject.sizeTypes !== undefined)
        && (sizeObject.sizeTypes.length !== 0)) {
            return (
                <div block="PDPAddToCart" elem="SizeSelector">
                    <select
                      key="SizeSelect"
                      block="PDPAddToCart"
                      elem="SizeSelectElement"
                      onChange={ onSizeSelect }
                      defaultValue="default"
                    >
                        <option value="default" disabled hidden>
                                { __('Please select size') }
                        </option>
                            { this.getSizeSelect() }
                    </select>
                </div>
            );
        }

        return null;
    }

    checkStateForButtonDisabling() {
        const {
            isLoading,
            addedToCart,
            product: { stock_qty, highlighted_attributes },
            product = {},
            basePrice
        } = this.props;
        if (isLoading
            || addedToCart
            || stock_qty === 0
            || highlighted_attributes === null
            || !parseInt(basePrice)
            || (Object.keys(product).length === 0
            && product.constructor === Object)) {
            return true;
        }

        return false;
    }

    renderAddToCartButton() {
        const {
            addToCart,
            isLoading,
            addedToCart,
            product: { stock_qty, highlighted_attributes, simple_products = {} },
            product = {}
        } = this.props;

        const disabled = this.checkStateForButtonDisabling();

        return (
            <div>
                { ((stock_qty !== 0 || highlighted_attributes === null
                    || (Object.keys(product).length !== 0
                    && product.constructor !== Object))
                    && Object.keys(simple_products).length !== 0)
                    && (
                        <button
                          onClick={ addToCart }
                          block="PDPAddToCart"
                          elem="AddToCartButton"
                          mods={ { isLoading } }
                          mix={ {
                              block: 'PDPAddToCart',
                              elem: 'AddToCartButton',
                              mods: { addedToCart }
                          } }
                          disabled={ disabled }
                        >
                            <span>{ __('Add to bag') }</span>
                            <span>{ __('Adding...') }</span>
                            <span>{ __('Added to bag') }</span>
                        </button>
                    ) }
            </div>
        );
    }

    renderProceedToCheckoutBlock = () => {
        const {
            showProceedToCheckout,
            hideCheckoutBlock,
            routeChangeToCart
        } = this.props;
        const { isIPhoneNavigationHidden } = this.state;

        if (showProceedToCheckout && isMobile.any()) {
            return (
                <div
                  block="PDPAddToCart"
                  elem="Checkout"
                  mods={ { hide: hideCheckoutBlock, isIPhoneNavigationHidden } }
                >
                    <h2 block="PDPAddToCart" elem="CheckoutTitle">{ __('Added to your shopping bag') }</h2>
                    <button
                      block="PDPAddToCart"
                      elem="CheckoutButton"
                      onClick={ routeChangeToCart }
                    >
                        { __('View Bag') }
                    </button>
                </div>
            );
        }

        return null;
    };

    renderContent() {
        const {
            product: { simple_products },
            sizeObject = {},
            processingRequest,
            setStockAvailability
        } = this.props;

        if (processingRequest) {
            return <div block="PDPAddToCart" elem="Placeholder" />;
        }

        // check for sizes availability in configurable products
        if (sizeObject.sizeCodes !== undefined
            && simple_products !== undefined
            && sizeObject.sizeCodes.length === 0
        ) {
            setStockAvailability(false);
            return null;
        }

        return (
            <>
                { this.renderSizeInfo() }
                <div block="PDPAddToCart" elem="SizeSelect">
                    { this.renderSizeTypeSelect() }
                    { this.renderSizeSelect() }
                </div>
                <div block="PDPAddToCart" elem="Bottom">
                    { this.renderAddToCartButton() }
                </div>
                { this.renderProceedToCheckoutBlock() }
            </>
        );
    }

    render() {
        return (
            <div block="PDPAddToCart">
                { this.renderContent() }
            </div>
        );
    }
}

export default PDPAddToCart;
