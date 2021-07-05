/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { Product } from 'Util/API/endpoint/Product/Product.type';
import isMobile from 'Util/Mobile';
import PDPSizeGuide from '../PDPSizeGuide';
import './PDPAddToCart.style';
import Spinner from "react-spinkit";
import NotifySuccessImg from "./icons/success-circle.png";




class PDPAddToCart extends PureComponent {
    static propTypes = {
        product: Product.isRequired,
        onSizeTypeSelect: PropTypes.func.isRequired,
        onSizeSelect: PropTypes.func.isRequired,
        addToCart: PropTypes.func.isRequired,
        sizeObject: PropTypes.object.isRequired,
        selectedSizeCode: PropTypes.string.isRequired,
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
        notifyMeEmail: "",
        isIPhoneNavigationHidden: false,
        pageYOffset: window.innerHeight,
        isRoundedIphone: this.isRoundedIphoneScreen() ?? false
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleResize);
        var data = localStorage.getItem("customer");
        if (data) {
            let userData = JSON.parse(data);
            if (userData?.data?.email && !!this.state.notifyMeEmail.length) {
                this.setState({ notifyMeEmail: userData.data.email })
            }
        }
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
        const {
            sizeObject = {},
            selectedSizeType,
            onSizeTypeSelect
        } = this.props;

        if (sizeObject.sizeTypes !== undefined) {
            const listItems = sizeObject.sizeTypes.map((type = '') => (
                <div
                    block="PDPAddToCart"
                    elem="SizeTypeOptionContainer"
                >
                    <input
                        type="radio"
                        key={type}
                        block="PDPAddToCart"
                        elem="SizeTypeOption"
                        value={type}
                        name="sizeType"
                        id={type}
                        checked={selectedSizeType === type}
                        onChange={onSizeTypeSelect}
                    >
                    </input>
                    <label for={type}>
                        {type.toUpperCase()}
                    </label>
                </div>
            ));

            return listItems;
        }

        return null;
    }

    renderSizeOption(simple_products, code, label) {
        const {
            selectedSizeCode,
            onSizeSelect
        } = this.props;
        const isNotAvailable = simple_products[code].quantity === 0;

        return (
            <div block="PDPAddToCart-SizeSelector" elem={isNotAvailable ? "SizeOptionContainerOOS" : "SizeOptionContainer"}>
                <input
                    id={code}
                    key={code}
                    type="radio"
                    elem="SizeOption"
                    name="size"
                    block="PDPAddToCart"
                    value={code}
                    onChange={onSizeSelect}
                    checked={selectedSizeCode === code}
                />
                <label for={code}>
                    {label}
                </label>
                <div />
                {isNotAvailable && <div className="line" />}
            </div>
        );
    }

    getSizeSelect() {
        const {
            product: { simple_products },
            product,
            selectedSizeType,
            sizeObject = {}
        } = this.props;

        if (sizeObject.sizeCodes !== undefined
            && simple_products !== undefined
            && product[`size_${selectedSizeType}`].length !== 0
        ) {
            return (
                <div block="PDPAddToCart-SizeSelector" elem="AvailableSizes">
                    {
                        sizeObject.sizeCodes.reduce((acc, code) => {
                            const label = simple_products[code].size[selectedSizeType];

                            if (label) {
                                acc.push(this.renderSizeOption(simple_products, code, label));
                            }

                            return acc;
                        }, [])
                    }
                </div>
            );
        }

        return null;
    }

    renderSizeInfo() {
        const { sizeObject, product } = this.props;

        if ((sizeObject.sizeTypes !== undefined)
            && (sizeObject.sizeTypes.length !== 0)) {
            return (
                <div block="PDPAddToCart" elem="SizeInfo">
                    <PDPSizeGuide product={product} />
                </div>
            );
        }

        return null;
    }

    renderSizeTypeSelect() {
        return (
            <div block="PDPAddToCart" elem="SizeTypeSelector">
                {this.getSizeTypeSelect()}
            </div>
        );
    }

    renderSizeSelect() {
        const {
            product: { simple_products },
            selectedSizeCode
        } = this.props;

        return (
            <>
                <div block="PDPAddToCart" elem="SizeSelector">
                    {this.getSizeSelect()}
                </div>
            </>
        );
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
            || !parseFloat(basePrice)
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
            <>
                {((stock_qty !== 0 || highlighted_attributes === null
                    || (Object.keys(product).length !== 0
                        && product.constructor !== Object))
                    && Object.keys(simple_products).length !== 0)
                    && (
                        <button
                            onClick={addToCart}
                            block="PDPAddToCart"
                            elem="AddToCartButton"
                            mods={{ isLoading }}
                            mix={{
                                block: 'PDPAddToCart',
                                elem: 'AddToCartButton',
                                mods: { addedToCart }
                            }}
                            disabled={disabled}
                        >
                            <span>{__('Add to bag')}</span>
                            <span>{__('Adding...')}</span>
                            <span>{__('Added to bag')}</span>
                        </button>
                    )}
            </>
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
                    mods={{ hide: hideCheckoutBlock, isIPhoneNavigationHidden }}
                >
                    <h2 block="PDPAddToCart" elem="CheckoutTitle">{__('Added to your shopping bag')}</h2>
                    <button
                        block="PDPAddToCart"
                        elem="CheckoutButton"
                        onClick={routeChangeToCart}
                    >
                        {__('View Bag')}
                    </button>
                </div>
            );
        }

        return null;
    };



    onNotifyMeSendClick = () => {
        const { showAlertNotification, sendNotifyMeEmail, notifyMeLoading } = this.props;
        if (notifyMeLoading) {
            return;
        }
        const { notifyMeEmail } = this.state;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (notifyMeEmail.length === 0 || !emailRegex.test(notifyMeEmail)) {
            showAlertNotification(__("That looks like an invalid email address"));
            return;
        }
        sendNotifyMeEmail(notifyMeEmail);
    }

    renderOutOfStock() {
        const { isOutOfStock, notifyMeLoading } = this.props;
        const { notifyMeEmail } = this.state;
        if (!isOutOfStock) {
            return null;
        }

        return (
            <div block="PDPAddToCart" elem="OutOfStockContainer">
                <span block="PDPAddToCart" elem="OutOfStockHeading">{__("out of stock")}</span>
                <span block="PDPAddToCart" elem="NotifyWhenAvailable">{__("Notify me when it’s available")}</span>
                <div block="PDPAddToCart" elem="EmailSendContainer">
                    <input block="PDPAddToCart" elem="EmailInput" placeholder="ALITA@GMAIL.COM" value={notifyMeEmail}
                        disabled={notifyMeLoading}
                        onChange={({ target }) => {
                            this.setState({ notifyMeEmail: target.value })
                        }} />
                    <span block="PDPAddToCart" elem="EmailSendBtn" onClick={this.onNotifyMeSendClick}>{notifyMeLoading ? __("Sending..") : __("Send")}</span>
                </div>
                {
                    notifyMeLoading &&
                    <div block="PDPAddToCart" elem="LoadingContainer">
                        <Spinner
                            color="white"
                            name="ball-scale-multiple"
                        />
                    </div>
                }
            </div>
        );
    }

    renderNotifyMeSuccess() {
        const { notifyMeSuccess } = this.props;
        if (!notifyMeSuccess) {
            return null;
        }

        return (
            <div block="PDPAddToCart" elem="NotifyMeSuccessContainer">
                <img src={NotifySuccessImg} alt="success circle" />
                <span>{__("We’ll let you know as soon as the product becomes available")}</span>
            </div>
        );
    }

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

        //console.log(sizeObject)
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
                {
                    (sizeObject.sizeTypes !== undefined) && (sizeObject.sizeTypes.length !== 0)
                        ?
                        <>
                            {this.renderOutOfStock()}
                            {this.renderNotifyMeSuccess()}
                            {this.renderSizeInfo()}
                            <div block="PDPAddToCart" elem="SizeSelect">
                                {this.renderSizeTypeSelect()}
                                {this.renderSizeSelect()}
                            </div>
                            <div block="Seperator" />
                        </>
                        :
                        null
                }
                <div block="PDPAddToCart" elem="Bottom">
                    {this.renderAddToCartButton()}
                </div>
                {this.renderProceedToCheckoutBlock()}
            </>
        );
    }

    render() {
        return (
            <div block="PDPAddToCart">
                {this.renderContent()}
            </div>
        );
    }
}

export default PDPAddToCart;
