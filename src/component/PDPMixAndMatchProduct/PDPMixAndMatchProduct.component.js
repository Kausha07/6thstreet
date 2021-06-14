import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import WishlistIcon from 'Component/WishlistIcon';
import Image from 'Component/Image';
import Price from "Component/Price";

import { isArabic, truncate } from 'Util/App';
import isMobile from 'Util/Mobile';

import './PDPMixAndMatchProduct.style';

class PDPMixAndMatchProduct extends PureComponent {
    static propTypes = {
        product: PropTypes.object.isRequired,
        setIsLoading: PropTypes.func.isRequired,
        selectedSizeCode: PropTypes.string.isRequired,
        selectedSizeType: PropTypes.string.isRequired,
        onSizeSelect: PropTypes.func.isRequired,
        addToCart: PropTypes.func.isRequired,
        routeChangeToCart: PropTypes.func.isRequired,
        togglePDPMixAndMatchProductSizePopup: PropTypes.func.isRequired
    };

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
            || !parseFloat(basePrice)
            || (Object.keys(product).length === 0
            && product.constructor === Object)) {
            return true;
        }

        return false;
    }

    renderWishlistIcon() {
        const { product: { sku } } = this.props;
        return (
            <WishlistIcon sku={ sku }  mods={ { isArabic: isArabic() } } />
        );
    }

    renderImage() {
        const { product: { thumbnail_url, } } = this.props;

        return (
            <>
                <div block="OverlayIcons"  mods={ { isArabic: isArabic() } }>
                    { this.renderWishlistIcon() }
                </div>
                <Image src={ thumbnail_url } />
            </>
        );
    }

    renderName() {
        const { product: { brand_name, name } } = this.props;

        return (
            <div block="PDPMixAndMatchProduct-SummaryAndAddToCartContainer" elem="NameContainer">
                <h3>
                    { brand_name }
                </h3>
                <h6>
                    { isMobile.any()?name:truncate(name, 20) }
                </h6>
            </div>
        );
    }

    renderColor() {
        const { product: { color } } = this.props;

        return (
            <div block="PDPMixAndMatchProduct-SummaryAndAddToCartContainer" elem="ColorContainer">
                <h3>
                    <span>Color: </span>
                    { color }
                </h3>
            </div>
        );
    }

    renderSizeSelect() {
        const {
           product: { simple_products }, selectedSizeCode, selectedSizeType, onSizeSelect, sizeObject, togglePDPMixAndMatchProductSizePopup
        } = this.props;

        const handleClick = (e) => {
            e.preventDefault();
            togglePDPMixAndMatchProductSizePopup();
        }

        if ((sizeObject.sizeTypes !== undefined)
        && (sizeObject.sizeTypes.length !== 0)) {
            const label = simple_products[selectedSizeCode].size[selectedSizeType];
            return (
                <div block="PDPMixAndMatchAddToCart" elem="SizeSelector">
                    <h3>
                        Size: 
                    </h3>
                    <button
                      key="SizeSelect"
                      block="PDPMixAndMatchAddToCart-SizeSelector"
                      elem="SizeSelectElement"
                      onClick={ handleClick }
                    >
                        { label }
                    </button>
                </div>
            );
        }

        return null;
    }

    
    renderPrice() {
        const {
            product: { price }
        } = this.props;

        return <Price price={price} />;
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
            <>
                { ((stock_qty !== 0 || highlighted_attributes === null
                    || (Object.keys(product).length !== 0
                    && product.constructor !== Object))
                    && Object.keys(simple_products).length !== 0)
                    && (
                        <button
                          onClick={ addToCart }
                          block="PDPMixAndMatchAddToCart"
                          elem="AddToCartButton"
                          mods={ { isLoading } }
                          mix={ {
                              block: 'PDPMixAndMatchAddToCart',
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
            </>
        );
    }

    renderAddToCart() {
        return (
            <div block="PDPMixAndMatchAddToCart">
                { this.renderSizeSelect() }
                { this.renderAddToCartButton() }
            </div>
        );
    }

    render() {
        return (
            <>
                <li block="PDPMixAndMatchProduct">
                    <div block="PDPMixAndMatchProduct" elem="ImageContainer">
                        { this.renderImage() }
                    </div>
                    <div block="PDPMixAndMatchProduct" elem="SummaryAndAddToCartContainer">
                        { this.renderName() }
                        { this.renderPrice() }
                        { this.renderColor() }
                        { this.renderAddToCart() }
                    </div>
                </li>
            </>
        );
    }
}

export default PDPMixAndMatchProduct;
