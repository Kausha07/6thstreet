/* eslint-disable react/jsx-one-expression-per-line */
import PropTypes from "prop-types";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Store } from "../Icons";
import Price from "Component/Price";
import { isObject } from "Util/API/helper/Object";
import { getDefaultEddMessage, getDefaultEddDate } from "Util/Date/index";

import Image from "Component/Image";
import Loader from "Component/Loader";
import { CartItemType } from "Type/MiniCart";
import { isArabic } from "Util/App";

import "./SuccessCheckoutItem.style";
import "./SuccessCheckoutItem.extended.style";
import {
  DEFAULT_ARRIVING_MESSAGE,
  EDD_MESSAGE_ARABIC_TRANSLATION,
  DEFAULT_SPLIT_KEY,
  DEFAULT_READY_MESSAGE,
  DEFAULT_READY_SPLIT_KEY,
  INTL_BRAND
} from "../../util/Common/index";

export const mapStateToProps = (state) => ({
  country: state.AppState.country,
  eddResponse: state.MyAccountReducer.eddResponse,
  intlEddResponse: state.MyAccountReducer.intlEddResponse,
  edd_info: state.AppConfig.edd_info,
  international_shipping_fee: state.AppConfig.international_shipping_fee,
});

export class SuccessCheckoutItem extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    item: CartItemType.isRequired,
    country: PropTypes.string.isRequired,
    currency_code: PropTypes.string.isRequired,
    isLikeTable: PropTypes.bool,
    history: PropTypes.object.isRequired,
    thumbnail: PropTypes.string.isRequired,
  };

  state = {
    isArabic: isArabic(),
    intlEddResponseState:{}
  };

  static getDerivedStateFromProps(props) {
    const {
      intlEddResponse
    } = props;

    return {
        intlEddResponseState:intlEddResponse
    };
  }

  static defaultProps = {
    isLikeTable: false,
  };

  state = {
    isArabic: isArabic(),
  };

  routeToProduct = () => {
    const {
      history,
      item: {
        product: { url },
      },
    } = this.props;

    history.push(url.split(".com")[1]);
  };

  renderWrapper() {
    return (
      <button
        onClick={this.routeToProduct}
        block="SuccessCheckoutItem"
        elem="Link"
      >
        <figure block="SuccessCheckoutItem" elem="Wrapper">
          {this.renderImage()}
          {this.renderContent()}
        </figure>
      </button>
    );
  }

  renderProductOptionValue = (optionValue, i, array) => {
    const { label, value } = optionValue;
    const isNextAvailable = Boolean(array[i + 1]);

    return (
      <span block="SuccessCheckoutItem" elem="ItemOptionValue" key={label}>
        {label || value}
        {isNextAvailable && ", "}
      </span>
    );
  };

  renderProductOption = (option = {}) => {
    const { label, values = [], id } = option;

    return (
      <div block="SuccessCheckoutItem" elem="ItemOption" key={id}>
        <div
          block="SuccessCheckoutItem"
          elem="ItemOptionLabel"
          key={`label-${id}`}
        >
          {`${label}:`}
        </div>
        <div block="SuccessCheckoutItem" elem="ItemOptionValues">
          {values.map(this.renderProductOptionValue)}
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
        block="SuccessCheckoutItem"
        elem="ItemOptionsWrapper"
        mods={{ isLikeTable }}
      >
        {itemOptions.map(this.renderProductOption)}
      </div>
    );
  }

  renderProductName() {
    const {
      item: {
        full_item_info: { brand_name, name },
      },
    } = this.props;
    const { isArabic } = this.state;
    return (
      <>
        <p block="SuccessCheckoutItem" elem="Heading" mods={{ isArabic }}>
          {brand_name}
        </p>
        <div block="SuccessCheckoutItem" elem="Details" mods={{ isArabic }}>
          {name}
        </div>
      </>
    );
  }

  renderProductPrice() {
    const {
      country,
      currency_code,
      item: { row_total, basePrice },
    } = this.props;
    const { isArabic } = this.state;

    let price = [
      {
        [currency_code]: {
          "6s_base_price": basePrice,
          "6s_special_price": row_total,
          default: row_total,
          default_formated: `${currency_code} ${row_total}`,
        },
      },
    ];

    return (
      <div block="SuccessCheckoutItem" elem="Price" mods={{ isArabic }}>
        <Price price={price} renderSpecialPrice={false} cart={true} />
      </div>
    );
  }

  renderClickAndCollectStoreName() {
    const {
      item: { extension_attributes },
    } = this.props;

    const { isArabic } = this.state;
    if (extension_attributes?.click_to_collect_store) {
      return (
        <div block="SuccessCheckoutItem" elem="ClickAndCollect" mods={{ isArabic }}>
          <div block="SuccessCheckoutItem-ClickAndCollect" elem="icon">
            <Store />
          </div>
          <div block="SuccessCheckoutItem-ClickAndCollect" elem="StoreName">
            {extension_attributes?.click_to_collect_store_name}
          </div>
        </div>
      );
    }
    return null;
  }


  renderColSizeQty() {
    const {
      item: { color, optionValue, qty },
    } = this.props;
    const { isArabic } = this.state;

    if (optionValue) {
      return (
        <div block="SuccessCheckoutItem" elem="ColSizeQty" mods={{ isArabic }}>
          {color ? (
            <span>
              {" "}
              {__("Color: ")} {color}
            </span>
          ) : null}

          <span>
            | {__("Size:")} {optionValue}
          </span>

          <span>
            | {__("Qty: ")} {qty}
          </span>
        </div>
      );
    }

    return (
      <div block="SuccessCheckoutItem" elem="ColSizeQty">
        {color ? (
          <span>
            {" "}
            {__("Color: ")} {color}
          </span>
        ) : null}

        <span>
          {color ? "|" : null} {__("Qty: ")}{" "}
        </span>
        {qty}
      </div>
    );
  }

  renderIntlTag() {
    const {isArabic} = this.state
    return (
      <span block="AdditionShippingInformation" mods={{ isArabic }}>
        {__("International Shipment")}
      </span>
    )
  }

  renderContent() {
    const {
      isLikeTable,
      item: {
        customizable_options,
        bundle_options,
        full_item_info: { cross_border = 0 },
        brand_name = "",
        international_vendor=null
      },
      edd_info,
      isFailed,
      eddResponse,
      intlEddResponse,
      international_shipping_fee,
    } = this.props;
    const isIntlBrand =
    cross_border === 1 && edd_info && edd_info.has_cross_border_enabled ;

    return (
      <figcaption
        block="SuccessCheckoutItem"
        elem="Content"
        mods={{
          isLikeTable,
        }}
      >
        {this.renderProductName()}
        {this.renderProductOptions(customizable_options)}
        {this.renderProductOptions(bundle_options)}
        {this.renderColSizeQty()}
        {this.renderProductPrice()}
        {this.renderClickAndCollectStoreName()}

        {edd_info &&
          edd_info.is_enable &&
          edd_info.has_thank_you &&
          ((isIntlBrand && Object.keys(intlEddResponse).length>0) || cross_border === 0 || edd_info.has_item_level) &&
          !isFailed &&
          this.renderEdd(cross_border === 1)}
        {((isIntlBrand && !isFailed) || (international_shipping_fee && cross_border)) ? this.renderIntlTag() : null}
      </figcaption>
    );
  }

  formatEddMessage = (crossBorder) => {
    const { isArabic } = this.state;
    let actualEddMess = "";
    const { item: { sku } } = this.props;
    const { eddResponse, edd_info, item: { extension_attributes, full_item_info:{ international_vendor = null}}, intlEddResponse } = this.props;
    const defaultDay = extension_attributes?.click_to_collect_store ? edd_info.ctc_message : edd_info.default_message
    const {
      defaultEddDateString,
      defaultEddDay,
      defaultEddMonth,
      defaultEddDat,
    } = getDefaultEddDate(defaultDay);
    let itemEddMessage = extension_attributes?.click_to_collect_store ? DEFAULT_READY_MESSAGE : DEFAULT_ARRIVING_MESSAGE
    let customDefaultMess = isArabic
      ? EDD_MESSAGE_ARABIC_TRANSLATION[itemEddMessage]
      : itemEddMessage;
    if(edd_info.has_item_level) {
      if(!(crossBorder && !edd_info.has_cross_border_enabled)) {
        if (eddResponse && isObject(eddResponse) && eddResponse["thankyou"]) {
          eddResponse["thankyou"].filter((data) => {
            if (data.sku === sku && data.feature_flag_status === 1) {
              if (extension_attributes?.click_to_collect_store) {
                actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
              } else {
                actualEddMess = isArabic
                  ? data.edd_message_ar
                  : data.edd_message_en;
              }
            }
          });
        } else {
          const isIntlBrand = crossBorder && edd_info.international_vendors && edd_info.international_vendors.indexOf(international_vendor)!==-1
          if(isIntlBrand && edd_info.default_message_intl_vendor) {
            const date_range = edd_info.default_message_intl_vendor.split("-");
            const start_date = date_range && date_range[0] ? date_range[0] : edd_info.default_message ;
            const end_date = date_range && date_range[1] ? date_range[1]: 0;
            const { defaultEddMess } = getDefaultEddMessage(
              parseInt(start_date),
              parseInt(end_date),
              1
            );
            actualEddMess = defaultEddMess;
          } else {
            actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
          }
        }
      }
    } else {
      const isIntlBrand = crossBorder && edd_info && edd_info.has_cross_border_enabled
      const intlEddObj = intlEddResponse['thankyou']?.find(({ vendor }) => vendor.toLowerCase() === international_vendor?.toString().toLowerCase());
      const intlEddMess = intlEddObj
        ? isArabic
          ? intlEddObj["edd_message_ar"]
          : intlEddObj["edd_message_en"]
        : isIntlBrand
        ? isArabic
          ? intlEddResponse["thankyou"][0]["edd_message_ar"]
          : intlEddResponse["thankyou"][0]["edd_message_en"]
        : "";
      
      if (eddResponse) {
        if (isObject(eddResponse)) {
          if (isIntlBrand) {
            actualEddMess = intlEddMess
          } else {
            Object.values(eddResponse).filter((entry) => {
              if (entry.source === "thankyou" && entry.featute_flag_status === 1) {
                if (extension_attributes?.click_to_collect_store) {
                  actualEddMess = `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
                } else {
                  actualEddMess = isArabic
                    ? entry.edd_message_ar
                    : entry.edd_message_en;
                }
              }
            });
          }
        } else {
          actualEddMess = isIntlBrand ? intlEddMess : `${customDefaultMess} ${defaultEddDat} ${defaultEddMonth}, ${defaultEddDay}`;
        }
      }
    }
    return actualEddMess;
  }

  renderEdd = (crossBorder) => {
    const { eddResponse, edd_info, item: { extension_attributes, brand_name = "", international_vendor }, intlEddResponse } = this.props;
    let actualEddMess = this.formatEddMessage(crossBorder);
    if (!actualEddMess) {
      return null;
    }
    let splitKey = DEFAULT_SPLIT_KEY;
    let splitReadyByKey = DEFAULT_READY_SPLIT_KEY
    return (
      <div block="AreaText" mods={{ isArabic }}>
        {extension_attributes?.click_to_collect_store ?
          <span>
            {splitReadyByKey}
          </span> : <span>
            {actualEddMess.split(splitKey)[0]}
            {splitKey}
          </span>
        }
        {extension_attributes?.click_to_collect_store ?
          <span>{actualEddMess.split(splitReadyByKey)[1]}</span>
          :
          <span>{actualEddMess.split(splitKey)[1]}</span>
        }
      </div>
    );
  };
  renderImage() {
    const {
      item: {
        product: { name },
      },
      thumbnail,
    } = this.props;
    const { isArabic } = this.state;

    return (
      <>
        <Image
          lazyLoad={true}
          src={thumbnail}
          mix={{
            block: "SuccessCheckoutItem",
            elem: "Picture",
            mods: { isArabic },
          }}
          ratio="custom"
          alt={`Product ${name} thumbnail.`}
        />
        <img style={{ display: "none" }} alt={name} src={thumbnail} />
      </>
    );
  }

  render() {
    const { isLoading } = this.props;

    return (
      <li block="SuccessCheckoutItem">
        <Loader isLoading={isLoading} />
        {this.renderWrapper()}
      </li>
    );
  }
}

export default withRouter(connect(mapStateToProps, null)(SuccessCheckoutItem));
