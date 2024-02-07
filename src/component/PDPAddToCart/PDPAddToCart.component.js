/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import { PureComponent } from "react";

import { Product } from "Util/API/endpoint/Product/Product.type";
import isMobile from "Util/Mobile";
import PDPSizeGuide from "../PDPSizeGuide";
import "./PDPAddToCart.style";
import { Rings } from "react-loader-spinner";

import NotifySuccessImg from "./icons/success-circle.png";
import { NOTIFY_EMAIL } from "./PDPAddToCard.config";
import BrowserDatabase from "Util/BrowserDatabase";
import { isSignedIn } from "Util/Auth";
import { customerType } from "Type/Account";
import Image from "Component/Image";
import Event, {
  EVENT_OUT_OF_STOCK,
  EVENT_OUT_OF_STOCK_MAIL_SENT,
  EVENT_GTM_PDP_TRACKING,
  EVENT_SIZE_PREDICTION_CLICK,
} from "Util/Event";
import "./PDPAddToCart.style";
import { isArabic } from "Util/App";
import StrikeThrough from "./icons/strike-through.png";
import clickAndCollectIcon from "../PDPDetailsSection/icons/clickAndCollect.png";
import Loader from "Component/Loader";

import { connect } from "react-redux";
import PDPTags from "Component/PDPTags";
import {fetchPredictedSize} from "../../util/API/endpoint/SizePredict/SizePredict.endpoint";
import { getCountryFromUrl } from "Util/Url";
import CDN from "Util/API/provider/CDN";

class PDPAddToCart extends PureComponent {

  constructor(props) {
    super(props);
    this.getRecommendedSize = this.getRecommendedSize.bind(this);
  }

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
    setStockAvailability: PropTypes.func.isRequired,
    stores: PropTypes.object.isRequired,
    togglePDPClickAndCollectPopup: PropTypes.func.isRequired,
    customer: customerType
  };

  state = {
    notifyMeEmail: BrowserDatabase.getItem(NOTIFY_EMAIL) || "",
    isIPhoneNavigationHidden: false,
    isGTMEventCalled: false,
    pageYOffset: window.innerHeight,
    isRoundedIphone: this.isRoundedIphoneScreen() ?? false,
    isArabic: isArabic(),
    customer: null,
    OOSrendered: false,
    OOS_mailSent: false,
    sizePredictorMessage:'',
    recommendedSizeSku:''
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleResize);

    window.addEventListener("userLogin", () => this.updateStateNotifyEmail());

    window.addEventListener("userLogout", () => this.updateStateNotifyEmail());

    const { customer, product: {brand_name} } = this.props;
    if (customer && customer.email) {
      this.setState({ notifyMeEmail: customer.email });
    }
    if(this.checkForCategoryAndGender()) {
      this.getBrandSizeSuggestion(brand_name);
    }
  }

  filtersuggestion(data, brand, country) {
    let filterData = data.filter(
      (item) => {
        if(item.brand.toLowerCase() == brand.toLowerCase() && item.country.toLowerCase() == country.toLowerCase()){
          return true;
        }
      }
    );
    if (filterData.length > 0) {
      return { message: filterData[0].message, ar_message: filterData[0].ar_message };
    }
    return {};
  }

  async getBrandSizeSuggestion (brand) {

    const country = getCountryFromUrl();
    let json_url = '';
    if (process.env.REACT_APP_FOR_JSON === "production") {
      json_url = `size_production/runsSmallOrBigger.json`;
    } else {
      json_url = `size/runsSmallOrBigger.json`;
    }
    try{
      const res = await CDN.get(json_url);
      if(res && res.result) {
        const suggestion = this.filtersuggestion(res.result, brand, country);
        if(suggestion && suggestion.message){
          this.props.addTag([suggestion.message]);
        }
      }
    } catch(e){
      console.log("error for reading brand json suggestion", e);
    }
  };

  componentDidUpdate(prevProps){
    const { selectedSizeCode } = this.props;
    if(prevProps.selectedSizeCode !== selectedSizeCode) {
      this.getRecommendedSize("size_bar");
    }
  }

  checkForCategoryAndGender(){
    const { product: { categories_without_path=[], gender}} = this.props;
    const isRequiredCategory = categories_without_path.some(item => (item.toLowerCase() === "shoes" || item.toLowerCase() === "أحذية"));
    let checkRequiredGender = false;
    if(typeof gender == 'string' && (gender.toLowerCase() == "men" || gender.toLowerCase() == "رجال")){
      checkRequiredGender = true;
    } else if (typeof gender == 'object' && Array.isArray(gender) && gender.some(item => item.toLowerCase() === "men" || item.toLowerCase() === "رجال")) {
      checkRequiredGender = true;
    }
    return isRequiredCategory && checkRequiredGender;
  }
  async getRecommendedSize(SizeBar){
    const { customer, selectedSizeCode, selectedSizeType, product: {sku, simple_products}} = this.props;
    if(customer && customer.email && this.checkForCategoryAndGender() && this.props.hasSizePredictor) {
      const optionValue = selectedSizeCode && simple_products[selectedSizeCode] && simple_products[selectedSizeCode]['size'] && simple_products[selectedSizeCode]['size']['eu'] ? simple_products[selectedSizeCode]['size']['eu']: '';
      const header = {
        sku: sku,
        size: optionValue,
        userEmail: customer.email,
      };
      try{
        const response = await fetchPredictedSize(header);

        if(response.status) {
          let message = response.message;
          if(!!!this.state.isGTMEventCalled){
            const eventData = {
              ...response, 
              sp_size_list: JSON.stringify(response?.sp_size_list),
              event_name : EVENT_SIZE_PREDICTION_CLICK,
              trigger_source: SizeBar? SizeBar: "size_help",
            }
            Event.dispatch(EVENT_SIZE_PREDICTION_CLICK, eventData);
            this.setState({
              isGTMEventCalled: true,
            })
          }
          let recSku = response.size;
          if(selectedSizeType == 'uk') {
            message = response.uk_message;
          } else if(selectedSizeType == 'us') {
            message = response.us_message;
          }
          Object.keys(simple_products).map((sku)=>{
            if(simple_products[sku]['size']['eu'] == response.size) {
              recSku = sku;
            }
          })
          this.setState({
            sizePredictorMessage: message,
            recommendedSizeSku: recSku
          });
        }
      } catch (e) {
        console.log("error", e);
      }
    }
  }

  updateStateNotifyEmail() {
    const {
      customer: { email },
      guestUserEmail,
    } = this.props;
    const { notifyMeEmail } = this.state;
    if (email && notifyMeEmail !== email) {
      this.setState({ notifyMeEmail: email });
    } else if (!email && guestUserEmail !== notifyMeEmail) {
      this.setState({
        notifyMeEmail: BrowserDatabase.getItem(NOTIFY_EMAIL) || "",
      });
    }
  }

  isRoundedIphoneScreen() {
    return (
      window.navigator.userAgent.match(/iPhone/) && window.outerHeight > "800"
    );
  }

  handleResize = () => {
    const { pageYOffset, isRoundedIphone } = this.state;

    this.setState({
      isIPhoneNavigationHidden:
        isRoundedIphone && window.pageYOffset > pageYOffset,
      pageYOffset: window.pageYOffset,
    });
  };

  getSizeTypeRadio() {
    const {
      sizeObject = {},
      selectedSizeType,
      onSizeTypeSelect,
      product,
    } = this.props;

    if (sizeObject.sizeTypes !== undefined) {
      const listItems = sizeObject.sizeTypes.map((type = "",index) => {
        if (product[`size_${type}`].length > 0) {
          return (
            <div
              key={index}
              block="PDPAddToCart"
              elem="SizeTypeOptionContainer"
              mods={{
                isArabic: isArabic(),
              }}
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
              ></input>
              <label for={type}>{type.toUpperCase()}</label>
            </div>
          );
        }
        return null;
      });

      return listItems;
    }

    return null;
  }

  getSizeTypeSelect() {
    const {
      sizeObject = {},
      onSizeTypeSelect,
      selectedSizeType,
      product,
    } = this.props;

    if (sizeObject.sizeTypes !== undefined) {
      return (
        <select
          key="SizeTypeSelect"
          block="PDPAddToCart"
          elem="SizeTypeSelectElement"
          value={selectedSizeType}
          onChange={onSizeTypeSelect}
        >
          {sizeObject.sizeTypes.map((type = "") => {
            if (type) {
              if (product[`size_${type}`]?.length > 0) {
                return (
                  <option
                    key={type}
                    block="PDPAddToCart"
                    elem="SizeTypeOption"
                    value={type}
                  >
                    {type.toUpperCase()}
                  </option>
                );
              }
            }
            return null;
          })}
        </select>
      );
    }

    return null;
  }

  renderSizeOption(productStock, code, label) {
    const {
      selectedSizeCode,
      onSizeSelect,
      notifyMeLoading,
      notifyMeSuccess,
      popUpType = "",
    } = this.props;
    const isNotAvailable = parseInt(productStock[code].quantity) === 0;
    const quantity = productStock[code].quantity;

    const selectedLabelStyle = {
      fontSize: "14px",
      color: "#ffffff",
      fontWeight: 600,
      letterSpacing: 0,
      backgroundColor: "#000000",
    };

    const selectedStrikeThruLineStyle = {
      opacity: 0.6,
      filter: "none",
    };

    const recommendedLabelStyle = {
      borderColor: "#4ef057",
    };

    const isCurrentSizeSelected = selectedSizeCode === code;
    const { edd_info } = this.props;

    return (
      <div
        block="PDPAddToCart-SizeSelector"
        elem={isNotAvailable ? "SizeOptionContainerOOS" : "SizeOptionContainer"}
        onClick={() => {
          if (!notifyMeLoading && !notifyMeSuccess) {
            onSizeSelect({ target: { value: code } });
          }
        }}
      >
        <input
          id={code}
          key={code}
          type="radio"
          elem="SizeOption"
          name="size"
          block="PDPAddToCart"
          value={code}
          checked={isCurrentSizeSelected}
        />
        <div>
          <label
            for={code}
            style={isCurrentSizeSelected ? selectedLabelStyle : this.state.recommendedSizeSku==code ? recommendedLabelStyle : {}}
          >
            {label}
          </label>
          {isNotAvailable && (
            <Image
              lazyLoad={false}
              src={StrikeThrough}
              className="lineImg"
              style={isCurrentSizeSelected ? selectedStrikeThruLineStyle : {}}
              alt={"strike-through"}
            />
          )}
        </div>
        {popUpType === "wishListPopUp" && (
          <div block="leftQuantity">
            {quantity < 6 && quantity > 0 && __("Last %s left", quantity)}
          </div>
        )}
        <div />
      </div>
    );
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getSizeSelect() {
    const {
      product,
      selectedSizeType,
      sizeObject = {},
      productStock = {},
    } = this.props;
    if (
      sizeObject.sizeCodes !== undefined &&
      Object.keys(productStock).length !== 0 &&
      product[`size_${selectedSizeType}`].length !== 0
    ) {
      return (
        <div block="PDPAddToCart-SizeSelector" elem="AvailableSizes">
          {sizeObject.sizeCodes.reduce((acc, code) => {
            const label = productStock[code].size[selectedSizeType];

            if (label) {
              acc.push(this.renderSizeOption(productStock, code, label));
            }

            return acc;
          }, [])}
        </div>
      );
    }

    return (
      <span id="notavailable">
        {this.capitalizeFirstLetter(`${__("out of stock")}`)}
      </span>
    );
  }

  renderSizeInfo() {
    const {
      sizeObject,
      product,
      product: { fit_size_url },
    } = this.props;

    if (
      sizeObject.sizeTypes !== undefined &&
      sizeObject.sizeTypes.length !== 0 && sizeObject.sizeCodes.length > 1
    ) {
      return (
        <div block="PDPAddToCart-SizeInfoContainer" elem="SizeInfo">
          <PDPSizeGuide product={product} getRecommendedSize={this.getRecommendedSize} />
        </div>
      );
    }

    return null;
  }

  renderSizeTypeSelect() {
    return (
      <div block="PDPAddToCart" elem="SizeTypeSelector">
        {isMobile.any() ? this.getSizeTypeRadio() : this.getSizeTypeSelect()}
      </div>
    );
  }

  renderSizeSelect() {
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
      basePrice,
      isOutOfStock,
      notifyMeLoading,
      notifyMeSuccess,
    } = this.props;
    if (
      isLoading ||
      isOutOfStock ||
      notifyMeLoading ||
      notifyMeSuccess ||
      addedToCart ||
      stock_qty === 0 ||
      highlighted_attributes === null ||
      !parseFloat(basePrice) ||
      (Object.keys(product).length === 0 && product.constructor === Object)
    ) {
      return true;
    }

    return false;
  }

  renderClickAndCollectButton() {
    const { togglePDPClickAndCollectPopup, stores } = this.props;
    if (!stores?.length) {
      return null;
    }
    const disabled = this.checkStateForButtonDisabling();
    return (
      <button
        onClick={togglePDPClickAndCollectPopup}
        block="PDPAddToCart"
        elem="ClickAndCollectButton"
        mods={{
          isArabic: isArabic(),
        }}
        disabled={disabled}
      >
        <div>{__("Click & Collect")}</div>
        <Image lazyLoad={true} src={clickAndCollectIcon} alt={"clickAndCollectIcon"} />
      </button>
    );
  }
  renderAddToCartButton() {
    const {
      addToCart,
      isLoading,
      addedToCart,
      product: { stock_qty, highlighted_attributes },
      product = {},
      productStock = {},
    } = this.props;

    const disabled = this.checkStateForButtonDisabling();

    return (
      <>
        {(stock_qty !== 0 ||
          highlighted_attributes === null ||
          (Object.keys(product).length !== 0 &&
            product.constructor !== Object)) &&
          Object.keys(productStock).length !== 0 && (
            <button
              onClick={() => addToCart()}
              block="PDPAddToCart"
              elem="AddToCartButton"
              mods={{ isLoading }}
              mix={{
                block: "PDPAddToCart",
                elem: "AddToCartButton",
                mods: { addedToCart },
              }}
              disabled={disabled}
            >
              <span>{__("Add to bag")}</span>
              <span>{__("Adding...")}</span>
              <span>{__("Added to bag")}</span>
            </button>
          )}
      </>
    );
  }

  renderProceedToCheckoutBlock = () => {
    const { showProceedToCheckout, hideCheckoutBlock, routeChangeToCart } =
      this.props;
    const { isIPhoneNavigationHidden } = this.state;

    if (showProceedToCheckout && isMobile.any()) {
      return (
        <div
          block="PDPAddToCart"
          elem="Checkout"
          mods={{ hide: hideCheckoutBlock, isIPhoneNavigationHidden }}
        >
          <h2 block="PDPAddToCart" elem="CheckoutTitle">
            {__("Added to your shopping bag")}
          </h2>
          <button
            block="PDPAddToCart"
            elem="CheckoutButton"
            onClick={routeChangeToCart}
          >
            {__("View Bag")}
          </button>
        </div>
      );
    }

    return null;
  };

  onNotifyMeSendClick = () => {
    const { showAlertNotification, sendNotifyMeEmail, notifyMeLoading } =
      this.props;
    if (notifyMeLoading) {
      return;
    }
    const { notifyMeEmail } = this.state;
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (notifyMeEmail.length === 0 || !emailRegex.test(notifyMeEmail)) {
      showAlertNotification(__("Please Enter a valid Email Id"));
      return;
    }
    sendNotifyMeEmail(notifyMeEmail);
  };

  renderOutOfStock() {
    const {
      isOutOfStock,
      notifyMeLoading,
      customer: { email },
      guestUserEmail,
      product: { name, sku },
    } = this.props;
    const { notifyMeEmail, OOSrendered } = this.state;
    if (!isOutOfStock) {
      return null;
    }
    const eventData = {
      name: EVENT_OUT_OF_STOCK,
      product_name: name,
      product_id: sku,
      action: "out_of_stock_message",
      stockStatus: "Out of Stock",
    };
    if (!OOSrendered) {
      Event.dispatch(EVENT_GTM_PDP_TRACKING, eventData);
    }
    this.setState({ OOSrendered: true });
    // if (email && notifyMeEmail !== email) {
    //   this.setState({ notifyMeEmail: email });
    // } else if (!email && guestUserEmail !== notifyMeEmail) {
    //   this.setState({
    //     notifyMeEmail: BrowserDatabase.getItem(NOTIFY_EMAIL) || "",
    //   });
    // }

    return (
      <div block="PDPAddToCart" elem="OutOfStockContainer">
        <span block="PDPAddToCart" elem="OutOfStockHeading">
          {__("out of stock")}
        </span>
        <span block="PDPAddToCart" elem="NotifyWhenAvailable">
          {__("Notify me when it’s available")}
        </span>
        <div block="PDPAddToCart" elem="EmailSendContainer">
          <input
            block="PDPAddToCart"
            elem="EmailInput"
            placeholder={`${__("Email")}*`}
            value={notifyMeEmail}
            disabled={notifyMeLoading}
            onChange={({ target }) => {
              this.setState({ notifyMeEmail: target.value });
            }}
          />
          <span
            block="PDPAddToCart"
            elem="EmailSendBtn"
            lang={isArabic() ? "ar" : "en"}
            onClick={this.onNotifyMeSendClick}
          >
            {notifyMeLoading ? __("Sending..") : __("Send")}
          </span>
        </div>
        {notifyMeLoading && (
          <div block="PDPAddToCart" elem="LoadingContainer">
            <Rings color="white" height={80} width={"100%"} />
          </div>
        )}
      </div>
    );
  }

  renderNotifyMeSuccess() {
    const {
      notifyMeSuccess,
      product: { name, sku },
    } = this.props;
    const { OOS_mailSent } = this.state;
    if (!notifyMeSuccess) {
      return null;
    }
    const eventData = {
      name: EVENT_OUT_OF_STOCK_MAIL_SENT,
      product_name: name,
      product_id: sku,
      action: "out_stock_mail_sent",
      stockStatus: "Out of Stock",
    };
    if (!OOS_mailSent) {
      Event.dispatch(EVENT_GTM_PDP_TRACKING, eventData);
    }
    this.setState({ OOS_mailSent: true });
    return (
      <div block="PDPAddToCart" elem="NotifyMeSuccessContainer">
        <Image lazyLoad={true} src={NotifySuccessImg} alt="success circle" />

        <span>
          {__("We’ll let you know as soon as the product becomes available")}
        </span>
      </div>
    );
  }

  renderNotAvailable() {
    const {
      product: { in_stock, stock_qty },
      notifyMeSuccess,
      isOutOfStock,
    } = this.props;
    if (in_stock === 0 && !isOutOfStock && !notifyMeSuccess) {
      return (
        <span id="notavailable">
          {this.capitalizeFirstLetter(`${__("out of stock")}`)}
        </span>
      );
    } else if (
      in_stock === 1 &&
      stock_qty === 0 &&
      !isOutOfStock &&
      !notifyMeSuccess
    ) {
      return (
        <span id="notavailable">
          {this.capitalizeFirstLetter(`${__("out of stock")}`)}
        </span>
      );
    }
    return null;
  }
  renderAppParity() {
    const {
      product: { brand_name = "", international_vendor = "" },
    } = this.props;

    if (
      brand_name.toString().toLowerCase() === "trendyol" ||
      brand_name.toString().toLowerCase() === "ترينديول"
    ) {
      return (
        <div block="AppParity">
          <p block="AppParity" elem="Text">
            {__("Select a size up for the right fit")}
          </p>
        </div>
      );
    }

    if (
      brand_name.toString().toLowerCase() === "boohoo" ||
      brand_name.toString().toLowerCase() === "بوهو" ||
      international_vendor === "boohoo_uk"
    ) {
      return (
        <div block="AppParity">
          <p block="AppParity" elem="Text">
            {__("This brand follows UK sizing standards")}
          </p>
        </div>
      );
    }
    return null;
  }

  renderContent() {
    const {
      product: { in_stock, stock_qty, brand_name },
      isOutOfStock,
      productStock = {},
      sizeObject = {},
      processingRequest,
      setStockAvailability,
      popUpType = "",
      isSizeLessProduct = false,
      isLoadingAddToCart = false,
    } = this.props;

    if (processingRequest) {
      return <div block="PDPAddToCart" elem="Placeholder" />;
    }

    // check for sizes availability in configurable products
    if (
      sizeObject.sizeCodes !== undefined &&
      Object.keys(productStock).length === 0 &&
      sizeObject.sizeCodes.length === 0
    ) {
      setStockAvailability(false);
      return null;
    }
    
    if (isMobile.any() && isSizeLessProduct && popUpType === "wishListPopUp") {
      return <Loader isLoading={isLoadingAddToCart} />;
    }

    return (
      <>
        {popUpType !== "wishListPopUp" && this.renderOutOfStock()}
        {this.renderNotifyMeSuccess()}
        {this.renderNotAvailable()}
        {sizeObject.sizeTypes !== undefined &&
        sizeObject.sizeTypes.length !== 0 ? (
          <>
            {popUpType !== "wishListPopUp" && (
              <div block="SeperatorAddtoCart" />
            )}
            {popUpType !== "wishListPopUp" && this.renderAppParity()}
            <div block="PDPAddToCart" elem="SizeInfoContainer">
              {in_stock !== 0? <h2 block="PDPAddToCart-SizeInfoContainer" elem="title">
                {__("Size:")}
              </h2> : null}
              {this.renderSizeInfo()}
            </div>
            <div block="PDPAddToCart" elem="SizeSelect">
              {in_stock !== 0 ? this.renderSizeTypeSelect(): null}
              {this.renderSizeSelect()}
            </div>
            {/* {isMobile.any() && <div block="Seperator" />} */}
          </>
        ) : null}
        {this.state.sizePredictorMessage && <PDPTags tags={[this.state.sizePredictorMessage]} /> }
        <div
          block="PDPAddToCart"
          elem="Bottom"
          mods={{
            isOutOfStock:
              popUpType === "wishListPopUp"
                ? false
                : stock_qty === 0 || isOutOfStock || !in_stock,
          }}
        >
          {this.renderAddToCartButton()}
          {this.renderClickAndCollectButton()}
        </div>
        {this.renderProceedToCheckoutBlock()}
      </>
    );
  }

  render() {
    return <div block="PDPAddToCart">{this.renderContent()}</div>;
  }
}

export const mapStateToProps = (state) => ({
  edd_info: state.AppConfig.edd_info,
  hasSizePredictor: state.AppConfig.hasSizePredictor
});

export default connect(mapStateToProps)(PDPAddToCart);
