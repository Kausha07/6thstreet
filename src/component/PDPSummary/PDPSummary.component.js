/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import { PureComponent, Fragment } from "react";
import Link from "Component/Link";
import PDPAddToCart from "Component/PDPAddToCart/PDPAddToCart.container";
import PDPAlsoAvailable from "Component/PDPAlsoAvailable";
import PDPTags from "Component/PDPTags";
import Price from "Component/Price";
import ProductLabel from "Component/ProductLabel/ProductLabel.component";
import ShareButton from "Component/ShareButton";
import WishlistIcon from "Component/WishlistIcon";
import { Product } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import { SPECIAL_COLORS, translateArabicColor } from "Util/Common";
import isMobile from "Util/Mobile";
import BrowserDatabase from "Util/BrowserDatabase";
import fallbackImage from "../../style/icons/fallback.png";
import { APP_STATE_CACHE_KEY } from "Store/AppState/AppState.reducer";
import { getGenderInArabic } from "Util/API/endpoint/Suggestions/Suggestions.create";
import TamaraWidget from "Component/TamaraWidget/TamaraWidget";
import {
  DEFAULT_MESSAGE,
  EDD_MESSAGE_ARABIC_TRANSLATION,
  INTL_BRAND,
  DEFAULT_SPLIT_KEY,
} from "../../util/Common/index";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { isObject } from "Util/API/helper/Object";
import { getDefaultEddMessage } from "Util/Date/index";
import { isSignedIn } from "Util/Auth";
import address from "./icons/address.png";
import addressBlack from "./icons/address_black.svg";
import Image from "Component/Image";
import "./PDPSummary.style";
import Event, {
  EVENT_GTM_EDD_VISIBILITY,
  EVENT_TABBY_LEARN_MORE_CLICK,
  EVENT_GTM_PDP_TRACKING,
  EVENT_MOE_EDD_VISIBILITY,
  MOE_trackEvent
} from "Util/Event";
import { TabbyPromoURL } from "./config";
import {CART_ITEMS_CACHE_KEY} from "../../store/Cart/Cart.reducer";
import DynamicContentCountDownTimer from "../DynamicContentCountDownTimer/DynamicContentCountDownTimer.component.js"
import { connect } from "react-redux";
import Ratings from 'Component/Ratings/Ratings';
import PDPBrandFollow from 'Component/PDPBrandFollow/PDPBrandFollow';
export const mapStateToProps = (state) => ({
  isNewDesign:state.AppConfig?.vwoData?.NewPDP?.isFeatureEnabled || false
});

class PDPSummary extends PureComponent {
  constructor(props) {
    super(props);
    this.alsoAvailableRef = React.createRef();
  }

  static propTypes = {
    product: Product.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    alsoAvailable: [],
    prevAlsoAvailable: [],
    showPopup: false,
    stockAvailibility: true,
    isArabic: isArabic(),
    selectedSizeType: "eu",
    selectedSizeCode: "",
    showCityDropdown: false,
    showAreaDropDown: false,
    selectedCityId: null,
    selectedAreaId: null,
    selectedArea: null,
    selectedCityArea: null,
    selectedCity: null,
    showPopupField: "",
    countryCode: null,
    cityResponse: null,
    eddEventSent: false,
    intlEddResponseState:{},
    isMobile: isMobile.any() || isMobile.tablet(),
    tagsFromAddToCart: []
  };

  getIdFromCityArea = (addressCityData, city, area) => {
    let cityEntry;
    let areaEntry;
    const { isArabic } = this.state;
    Object.values(addressCityData).filter((entry) => {
      if (entry.city === city || entry.city_ar === city) {
        cityEntry = isArabic ? entry.city_ar : entry.city;
        if (entry.city === city) {
          Object.values(entry.areas).filter((cityArea, index) => {
            if (cityArea === area) {
              areaEntry = isArabic ? entry.areas_ar[index] : entry.areas[index];
            }
          });
        } else {
          Object.values(entry.areas_ar).filter((cityArea,index) => {
            if (cityArea === area) {
              areaEntry = isArabic ? entry.areas_ar[index] : entry.areas[index];
            }
          });
        }
      }
    });
    return { cityEntry, areaEntry };
  };

  // Set city area when it is stored in session, this function will be invoked incase of refresh
  getCityAreaFromStorage = (addressCityData, countryCode) => {
    const sessionData = JSON.parse(sessionStorage.getItem("EddAddressReq"));
    const { city, area } = sessionData;
    const { cityEntry, areaEntry } = this.getIdFromCityArea(
      addressCityData,
      city,
      area
    );
    this.setState(
      {
        cityResponse: addressCityData,
        selectedCity: cityEntry,
        selectedCityId: cityEntry,
        selectedAreaId: areaEntry,
        selectedArea: areaEntry,
        countryCode: countryCode,
      },
      () => {
        let data = { area: areaEntry, city: cityEntry, country: countryCode };
        this.getEddResponse(data, false);
      }
    );
  };

  getCityAreaFromDefault = (addressCityData, countryCode) => {
    const { defaultShippingAddress, edd_info, estimateEddResponse } = this.props;
    const { area, city } = defaultShippingAddress;
    const { cityEntry, areaEntry } = this.getIdFromCityArea(
      addressCityData,
      city,
      area
    );
    this.setState(
      {
        cityResponse: addressCityData,
        selectedCity: cityEntry,
        selectedCityId: cityEntry,
        selectedAreaId: areaEntry,
        selectedArea: areaEntry,
        countryCode: countryCode,
      },
      () => {
        let data = { area: areaEntry, city: cityEntry, country: countryCode };
        let payload = {};
        if(edd_info?.has_item_level) {
          let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
          data.intl_vendors=null;
          let items = [];
          items_in_cart.map(item => {
            if(!(item && item.full_item_info && item.full_item_info.cross_border && !edd_info.has_cross_border_enabled)) {
              payload = { sku : item.sku, intl_vendor : item?.full_item_info?.cross_border && edd_info.international_vendors && item.full_item_info.international_vendor && edd_info.international_vendors.indexOf(item.full_item_info.international_vendor)>-1 ? item?.full_item_info?.international_vendor : null}
              payload["qty"] = parseInt(item?.full_item_info?.available_qty);
              payload["cross_border_qty"] = parseInt(item?.full_item_info?.cross_border_qty) ? parseInt(item?.full_item_info?.cross_border_qty): "";
              payload["brand"] = item?.full_item_info?.brand_name;
              items.push(payload);
            }
          })
          data.items = items;
          if(items.length) estimateEddResponse(data, true);
        } else {
          estimateEddResponse(data, true);
        }
      }
    );
  };
// To fetch edd from api
  getEddResponse = (data, type) => {
    const { estimateEddResponse, edd_info } = this.props;
    const { area, city, country } = data;

    let request = {
      country: country,
      city: city,
      area: area,
      courier: null,
      source: null,
    };
    let payload = {};
    if(edd_info?.has_item_level) {
      let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
      request.intl_vendors=null;
      let items = [];
      items_in_cart.map(item => {
        if(!(item && item.full_item_info && item.full_item_info.cross_border && !edd_info?.has_cross_border_enabled)) {
          payload = { sku : item.sku, intl_vendor : item?.full_item_info?.cross_border && edd_info.international_vendors && item.full_item_info.international_vendor && edd_info.international_vendors.indexOf(item.full_item_info.international_vendor)>-1 ? item?.full_item_info?.international_vendor : null}
          payload["qty"] = parseInt(item?.full_item_info?.available_qty);
          payload["cross_border_qty"] = parseInt(item?.full_item_info?.cross_border_qty) ? parseInt(item?.full_item_info?.cross_border_qty): "";
          payload["brand"] = item?.full_item_info?.brand_name;
          items.push(payload);
        }
      });
      request.items = items;
      if(items.length) estimateEddResponse(request, type);
    } else {
      estimateEddResponse(request, type);
    }
  };

  // It will decide which criteria to be called setting reducer and session
  validateEddStatus = () => {
    const countryCode = getCountryFromUrl();
    const { defaultShippingAddress, addressCityData, setEddResponse } =
      this.props;
    if (isSignedIn() && defaultShippingAddress) {
      this.getCityAreaFromDefault(addressCityData, countryCode);
    } else if (
      isSignedIn() &&
      !defaultShippingAddress &&
      sessionStorage.getItem("EddAddressReq")
    ) {
      this.getCityAreaFromStorage(addressCityData, countryCode);
    } else if (!isSignedIn() && sessionStorage.getItem("EddAddressReq")) {
      this.getCityAreaFromStorage(addressCityData, countryCode);
    } else {
      this.setState({
        cityResponse: addressCityData,
        countryCode: countryCode,
      });
      setEddResponse(null, null);
    }
  };

  getTabbyResponse = () =>{
    const {
      product: { price },
      TabbyInstallment
    } = this.props;
    const script = document.createElement("script");
    script.src = TabbyPromoURL;
    document.body.appendChild(script);
    if (price) {
      const priceObj = Array.isArray(price) ? price[0] : price;
      const [currency, priceData] = Object.entries(priceObj)[0];
      const { default: defPrice } = priceData;
      script.onload = TabbyInstallment(defPrice, currency);
    }
  }

  componentDidMount() {
    const {
      product,
      addressCityData,
    } = this.props;
    this.getTabbyResponse();
    const countryCode = getCountryFromUrl();
    this.setState({
      countryCode: countryCode,
      cityResponse: addressCityData,
    });
    this.setState({
      alsoAvailable: product["6s_also_available"]
    })
    this.getEddForPDP();
    this.setCityAndArea();
  }

  setCityAndArea() {
    const { edd_info } = this.props;
    if(edd_info && edd_info.is_enable && edd_info.has_item_level) {
      const countryCode = getCountryFromUrl();
      const { addressCityData } = this.props;
      if (sessionStorage.getItem("EddAddressReq")) {
        const sessionData = JSON.parse(sessionStorage.getItem("EddAddressReq"));
        const { city, area } = sessionData;
        const { cityEntry, areaEntry } = this.getIdFromCityArea(
          addressCityData,
          city,
          area
        );
        this.setState(
          {
            cityResponse: addressCityData,
            selectedCity: cityEntry,
            selectedCityId: cityEntry,
            selectedAreaId: areaEntry,
            selectedArea: areaEntry,
            countryCode: countryCode,
          }
        );
      }
    }
  }

  getEddForPDP(areaSelected = null) {
    const {
      estimateEddResponseForPDP,
      edd_info,
      product: {
        simple_products = {},
        cross_border = 0,
        international_vendor = null,
        brand_name = "",
      },
    } = this.props;
    if(edd_info &&
      edd_info.is_enable &&
      edd_info.has_pdp && edd_info.has_item_level) {
      let {city, area, countryCode} = this.getSelectedCityAreaCountry();
      area = areaSelected ? areaSelected : area;
      city = this.state.selectedCity ? this.state.selectedCity: city;
      const { addressCityData } = this.props;
      let cross_border_qty = 0;
      if (typeof simple_products === "object" && simple_products !== null) {
        Object.values(simple_products).forEach((obj) => {
          if (
            parseInt(obj.cross_border_qty) &&
            parseInt(obj.quantity) <= parseInt(obj.cross_border_qty)
          ) {
            cross_border_qty = 1;
          }
        });
      }
      if(city && area && countryCode) {
        const { cityEntry, areaEntry } = this.getIdFromCityArea(
          addressCityData,
          city,
          area
        );
        let request = {
          country: countryCode,
          city: cityEntry,
          area: areaEntry,
          courier: null,
          source: null,
        };
        request.intl_vendors=null;
        let payload = {};
        if (!(cross_border_qty && !edd_info?.has_cross_border_enabled)) {
          let items = [];
          Object.keys(simple_products).map((sku) => {
            payload = {
              sku: sku,
              intl_vendor:
                parseInt(simple_products[sku]?.cross_border_qty) &&
                parseInt(simple_products[sku]?.quantity) <=
                  parseInt(simple_products[sku]?.cross_border_qty) &&
                edd_info.international_vendors &&
                international_vendor &&
                edd_info.international_vendors.indexOf(international_vendor) >
                  -1
                  ? international_vendor
                  : null,
            };

            payload["qty"] = parseInt(simple_products?.[sku]?.quantity);
            payload["cross_border_qty"] = parseInt(simple_products?.[sku]?.cross_border_qty) ? parseInt(simple_products?.[sku]?.cross_border_qty): "";
            payload["brand"] = brand_name;

            items.push(payload);
          });
          request.items = items;
          estimateEddResponseForPDP(request, true);
        }
      }
    }
  }

  getSelectedCityAreaCountry = () => {
    const countryCode = getCountryFromUrl();
    const { defaultShippingAddress } = this.props;
    const sessionData = sessionStorage.getItem("EddAddressReq");
    let city = "";
    let area = "";
    if(sessionData) {
       let data = JSON.parse(sessionData);
       city = data.city;
       area = data.area;
    } else if(defaultShippingAddress) {
      city = defaultShippingAddress.city;
      area = defaultShippingAddress.area;
    }
    return {city, area, countryCode};
  };

  componentDidUpdate(prevProps) {
    const {
      product: { cross_border = 0, price, simple_products = {} },
      edd_info,
      defaultShippingAddress,
      addressCityData,
    } = this.props;
    const countryCode = getCountryFromUrl();

    const { eddEventSent } = this.state;
    let cross_border_qty = 0;
    if (typeof simple_products === "object" && simple_products !== null) {
      Object.values(simple_products).forEach((obj) => {
        if (
          parseInt(obj.cross_border_qty) &&
          parseInt(obj.quantity) <= parseInt(obj.cross_border_qty)
        ) {
          cross_border_qty = 1;
        }
      });
    }
    const {
      defaultShippingAddress: prevdefaultShippingAddress,
      addressCityData: prevAddressCitiesData,
    } = prevProps;
    if (
      edd_info &&
      edd_info.is_enable &&
      edd_info.has_pdp &&
      !eddEventSent &&
      cross_border_qty === 0 &&
      !edd_info.has_item_level
    ) {
      if (addressCityData?.length > 0) {
        this.validateEddStatus(countryCode);
        let default_edd = defaultShippingAddress ? true : false;
        Event.dispatch(EVENT_GTM_EDD_VISIBILITY, {
          edd_details: {
            edd_status: edd_info.has_pdp,
            default_edd_status: default_edd,
            edd_updated: false,
          },
          page: "pdp",
        });
        MOE_trackEvent(EVENT_MOE_EDD_VISIBILITY, {
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          edd_status: edd_info.has_pdp,
          edd_updated: false,
          default_edd_status: default_edd,
          app6thstreet_platform: "Web",
        });

        this.setState({
          eddEventSent: true,
        });
      }
    }
    if (
      prevAddressCitiesData &&
      addressCityData &&
      prevAddressCitiesData.length !== addressCityData.length
    ) {
      this.setState({
        cityResponse: addressCityData,
      });
      this.validateEddStatus();
      this.getEddForPDP();
    }
    if (
      JSON.stringify(prevdefaultShippingAddress) !==
      JSON.stringify(defaultShippingAddress) &&
      defaultShippingAddress
    ) {
      const { country_code, area, city } = defaultShippingAddress;

      if (edd_info && edd_info.is_enable) {
        const { cityEntry, areaEntry } = this.getIdFromCityArea(
          addressCityData,
          city,
          area
        );
        this.setState(
          {
            cityResponse: addressCityData,
            selectedCity: cityEntry,
            selectedCityId: cityEntry,
            selectedAreaId: areaEntry,
            selectedArea: areaEntry,
          },
          () => {
            let data = {
              area: areaEntry,
              city: cityEntry,
              country: country_code,
            };
            this.getEddResponse(data, false);
          }
        );
      }
    }

    if (this.props?.colourVarientsButtonClick) {
      setTimeout(() => {
        this.scrollToRef();
      }, 2000);
    }
  }

  scrollToRef = () => {
    if (this?.alsoAvailableRef?.current) {
      this?.alsoAvailableRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  static getDerivedStateFromProps(props, state) {
    const { product,intlEddResponse } = props;

    const { alsoAvailable, prevAlsoAvailable } = state;

    const derivedState = {};

    if (prevAlsoAvailable !== product["6s_also_available"]) {
      Object.assign(derivedState, {
        alsoAvailable: product["6s_also_available"],
        prevAlsoAvailable: alsoAvailable !== undefined ? alsoAvailable : null,
      });
    }
    
    return {derivedState:Object.keys(derivedState).length ? derivedState : null,
      intlEddResponseState:intlEddResponse};
  }

  closeAreaOverlay = () => {
    const { showCityDropdown } = this.state;
    document.body.style.overflow = "visible";
    this.setState({
      showCityDropdown: !showCityDropdown,
      showAreaDropDown: false,
    });
  };

  handleAreaDropDownClick = () => {
    const { showCityDropdown, isMobile } = this.state;
    if (isMobile) {
      document.body.style.overflow = "hidden";
    }
    this.setState({
      showCityDropdown: !showCityDropdown,
      showAreaDropDown: false,
      showPopupField: "city",
    });
  };

  callEstimateEddAPI = (area = null) => {
    const { selectedCity, countryCode, selectedArea } = this.state;
    const { estimateEddResponse, edd_info } = this.props;
    if(selectedCity && (selectedArea || area)) {
      let request = {
        country: countryCode,
        city: selectedCity,
        area: area ? area : selectedArea,
        courier: null,
        source: null,
      };
      let payload = {};
      if(edd_info?.has_item_level) {
        let items_in_cart = BrowserDatabase.getItem(CART_ITEMS_CACHE_KEY) || [];
        request.intl_vendors=null;
        let items = [];
        items_in_cart.map(item => {
          if(!(item && item.full_item_info && item.full_item_info.cross_border && !edd_info?.has_cross_border_enabled)) {
            payload = { sku : item.sku, intl_vendor : item?.full_item_info?.cross_border && item?.full_item_info?.international_vendor && edd_info.international_vendors && edd_info.international_vendors.indexOf(item?.full_item_info?.international_vendor)>-1 ? item?.full_item_info?.international_vendor : null}
            payload["qty"] = parseInt(item?.full_item_info?.available_qty);
            payload["cross_border_qty"] = parseInt(item?.full_item_info?.cross_border_qty) ? parseInt(item?.full_item_info?.cross_border_qty): "";
            payload["brand"] = item?.full_item_info?.brand_name;
            items.push(payload);
          }
        });
        request.items = items;
        if(items.length) estimateEddResponse(request, true);
      } else {
        estimateEddResponse(request, true);
      }
    }
  }

  handleAreaSelection = (area) => {
    const { defaultShippingAddress, edd_info } =this.props;
    this.setState({
      selectedAreaId: area,
      selectedArea: area,
      showCityDropdown: false,
      showPopupField: "",
    });
    this.handleAreaDropDownClick();
    let default_edd = defaultShippingAddress ? true : false;
    Event.dispatch(EVENT_GTM_EDD_VISIBILITY, {
      edd_details: {
        edd_status: edd_info.has_pdp,
        default_edd_status: default_edd,
        edd_updated: true,
      },
      page: "pdp",
    });
    MOE_trackEvent(EVENT_MOE_EDD_VISIBILITY, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      edd_status: edd_info.has_pdp,
      edd_updated: true,
      default_edd_status: default_edd,
      app6thstreet_platform: "Web",
    });
    this.getEddForPDP(area);
    this.callEstimateEddAPI(area);
    document.body.style.overflow = "visible";
  };

  handleCitySelection = (city) => {
    const { isArabic } = this.state;
    this.setState({
      showPopupField: "area",
      selectedCityId: isArabic ? city.city_ar : city.city,
      selectedCity: isArabic ? city.city_ar : city.city,
      selectedCityArea: isArabic ? city.areas_ar : city.areas,
      showAreaDropDown: true,
    });
  };

  renderSelectAreaItem() {
    const { selectedCityArea, isArabic } = this.state;
    const isArea = selectedCityArea && selectedCityArea.length > 0;
    return (
      <ul>
        {isArea ? (
          selectedCityArea.map((area, index) => {
            return (
              <li key={index} id={area} onClick={() => this.handleAreaSelection(area)}>
                <button
                  block={`CountrySwitcher`}
                  elem="CountryBtn"
                  mods={{ isArabic, isArea }}
                >
                  <span>{area}</span>
                </button>
              </li>
            );
          })
        ) : (
          <span block="NoAreaFound">No Area Found</span>
        )}
      </ul>
    );
  }
  renderSelectCityItem() {
    const { cityResponse, isArabic } = this.state;
    if (!cityResponse) {
      return (
        <ul>
          <span block="NoAreaFound">No City Found</span>
        </ul>
      );
    }
    return (
      <ul>
        {Object.values(cityResponse).map((city) => {
          return (
            <li
            key={city.city_id}
              id={city.city_id}
              onClick={() => this.handleCitySelection(city)}
            >
              <button
                block={`CountrySwitcher`}
                elem="CountryBtn"
                mods={{ isArabic }}
              >
                <span>{isArabic ? city.city_ar : city.city}</span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }
  renderMobileSelectCity() {
    const { isArabic, showPopupField } = this.state;
    return (
      <div block="EddMobileWrapper">
        <div mix={{ block: "EddMobileWrapper", elem: "Content" }}>
          <div
            mix={{ block: "EddMobileWrapper-Content", elem: "EddBackHeader" }}
          >
            <button
              elem="Button"
              block="MyAccountMobileHeader"
              onClick={this.closeAreaOverlay}
              mods={{ isArabic }}
            />
          </div>
          <div
            mix={{
              block: "EddMobileWrapper-Content",
              elem: "EddContentHeader",
            }}
          >
            <div
              block="CityText ContentText"
              mods={{ isShown: showPopupField === "city" ? true : false }}
              onClick={() => this.setState({ showPopupField: "city" })}
            >
              <span>Select City</span>
            </div>
            <div
              block="ContentText"
              mods={{ isShown: showPopupField === "area" ? true : false }}
            >
              <span>{isArabic ? "حدد المنطقة" : "Select Area"}</span>
            </div>
          </div>

          {showPopupField === "city" && (
            <div block="CityDrop">{this.renderSelectCityItem()}</div>
          )}
          {showPopupField === "area" && (
            <div block="CityDrop">{this.renderSelectAreaItem()}</div>
          )}
        </div>
      </div>
    );
  }

  getInStockSKU = (simple_products) => {
    let arr = [];

    if (Object.values(simple_products)?.[0]?.quantity > 0) {
      arr.push(Object.keys(simple_products)?.[0]);
    } else {
      arr = Object.keys(simple_products).filter(
        (sku) => simple_products?.[sku]?.quantity > 0
      );
    }
    if (arr?.length > 0) {
      return arr?.[0];
    }

    return null;
  };

  formatEddMessage(crossBorder){
    let actualEddMess = "";
    const {
      edd_info,
      product: { brand_name = "",simple_products = {}, international_vendor=null },
      eddResponse,
      eddResponseForPDP,
      intlEddResponse,
    } = this.props;

    const { isArabic, selectedSizeCode } = this.state;

    let sku = selectedSizeCode
      ? selectedSizeCode
      : this.getInStockSKU(simple_products);

    if (sku === null) {
      return null;
    }

    const { defaultEddMess: defaultEddMessBasedOnInventory = "" } =
      getDefaultEddMessage(edd_info?.default_message, 0, 0);
    let splitKey = DEFAULT_SPLIT_KEY;

    if(edd_info?.has_item_level) {
      if(!(crossBorder && !edd_info.has_cross_border_enabled)) {
        if (eddResponseForPDP && isObject(eddResponseForPDP) && eddResponseForPDP["pdp"]) {
          eddResponseForPDP["pdp"].filter((data) => {
            if (data.sku == sku  && data.feature_flag_status == 1) {
              actualEddMess = isArabic
                ? data.edd_message_ar
                : data.edd_message_en;
            }
          })
        } else {
          const isIntlBrand = crossBorder && edd_info.international_vendors && edd_info.international_vendors.indexOf(international_vendor)!==-1
          if(isIntlBrand && edd_info?.intl_vendor_edd_range) {
            const date_range = edd_info?.intl_vendor_edd_range?.[international_vendor?.toLowerCase()]?.split("-");
            const start_date = date_range && date_range[0] ? date_range[0] : edd_info.default_message ;
            const end_date = date_range && date_range[1] ? date_range[1]: 0;
            const { defaultEddMess } = getDefaultEddMessage(
              parseInt(start_date),
              parseInt(end_date),
              1
            );
            actualEddMess = defaultEddMess;
          } else {
            const { defaultEddMess } = getDefaultEddMessage(
              edd_info.default_message,
              0,
              0
            );
            actualEddMess = defaultEddMess;
          }
        }
        actualEddMess =
          actualEddMess?.split(splitKey)?.[1]?.includes("-") &&
          selectedSizeCode &&
          +simple_products?.[sku]?.quantity >
            +simple_products?.[sku]?.cross_border_qty
            ? defaultEddMessBasedOnInventory
            : actualEddMess;
      }
    } else {
      const isIntlBrand =
        ((INTL_BRAND.includes(brand_name.toString().toLowerCase()) && crossBorder) ||
        crossBorder) && edd_info && edd_info.has_cross_border_enabled; // To check whether it is international product or not deciding based on brand_name
      const intlEddObj = intlEddResponse["pdp"]?.find(
        ({ vendor }) => vendor.toLowerCase() === international_vendor?.toString().toLowerCase()
      );
      const intlEddMess = intlEddObj
        ? isArabic
          ? intlEddObj["edd_message_ar"]
          : intlEddObj["edd_message_en"]
        : isIntlBrand
        ? isArabic
          ? intlEddResponse["pdp"][0]["edd_message_ar"]
          : intlEddResponse["pdp"][0]["edd_message_en"]
        : "";

      if (eddResponse && isObject(eddResponse)) {
        if (isIntlBrand) { // For gcc, cross_border=1, but brand not from [trendyol, kotton]

          actualEddMess = intlEddMess;
        } else {
          Object.values(eddResponse).filter((entry) => {
            if (entry.source === "pdp" && entry.feature_flag_status === 1) {
              actualEddMess = isArabic
                ? entry.edd_message_ar
                : entry.edd_message_en;
            }
          });
        }
      } else {
        const { defaultEddMess } = getDefaultEddMessage(
          edd_info.default_message,
          0,
          crossBorder
        );
        actualEddMess = isIntlBrand ? intlEddMess : defaultEddMess;
      }

      actualEddMess =
        actualEddMess?.split(splitKey)?.[1]?.includes("-") &&
        selectedSizeCode &&
        +simple_products?.[sku]?.quantity >
          +simple_products?.[sku]?.cross_border_qty
          ? defaultEddMessBasedOnInventory
          : actualEddMess;
    }
    return actualEddMess;
  }

  renderSelectCity(crossBorder) {
    const {
      showCityDropdown,
      showAreaDropDown,
      selectedCityArea,
      selectedAreaId,
      selectedArea,
      isMobile,
      isArabic,
      selectedSizeCode,
    } = this.state;
    const {
      edd_info,
      product: { international_vendor = null, simple_products = {}, },
    } = this.props;
    const sku = selectedSizeCode || this.getInStockSKU(simple_products);
    let actualEddMess = this.formatEddMessage(crossBorder);
    if (actualEddMess === null) {
      return null;
    }
    const isArea = !(
      selectedCityArea && Object.values(selectedCityArea).length > 0
    );

    if (isMobile && showCityDropdown) {
      return this.renderMobileSelectCity();
    }
    let splitKey = DEFAULT_SPLIT_KEY;
    let EddMessMargin =
    selectedAreaId &&
    edd_info.international_vendors.indexOf(international_vendor) === -1
      ? true
      : false;

      if (+simple_products?.[sku]?.quantity === 0) {
        return null;
      }
    return (
      <div block="EddParentWrapper" >
        <div block="EddWrapper">
          {actualEddMess && (
            <div
              mix={{
                block: "EddWrapper",
                elem: `AreaText`,
                mods: { isArabic },
              }}
              block={
                EddMessMargin
                  ? `EddMessMargin ${isArabic ? "isArabic" : ""}`
                  : ""
              }
            >
              <span>
                {actualEddMess.split(splitKey)[0]}
                {splitKey}
              </span>
              <span>{actualEddMess.split(splitKey)[1]}</span>
            </div>
          )}
          {((!crossBorder && !edd_info.has_item_level) || (edd_info.has_item_level && !crossBorder) || (edd_info.has_item_level && crossBorder && edd_info.international_vendors && edd_info.international_vendors.indexOf(international_vendor)===-1)) && (
            <>
              {selectedAreaId ? (
                <div
                  block={`EddWrapper SelectedAreaWrapper`}
                  mods={{ isArabic }}
                  onClick={() => this.handleAreaDropDownClick()}
                >
                  <Image lazyLoad={false} src={addressBlack} alt="" />
                  <div block={`SelectAreaText `}>{selectedArea}</div>
                </div>
              ) : (
                <div
                  block="EddWrapper"
                  elem="AreaButton"
                  mods={{ isArabic }}
                  onClick={() => this.handleAreaDropDownClick()}
                >
                  <Image lazyLoad={false} src={address} alt="" />
                  <div block="SelectAreaText">
                    {isArabic ? "حدد المنطقة" : "Select Area"}
                  </div>
                </div>
              )}
            </>
          )}
          <div block="DropDownWrapper">
            {showCityDropdown && !isMobile && (
              <div mix={{ block: "EddWrapper", elem: "CountryDrop" }}>
                {this.renderSelectCityItem()}
              </div>
            )}
            {showCityDropdown && showAreaDropDown && !isMobile && (
              <div
                block="AreaDropdown"
                mix={{
                  block: "EddWrapper",
                  elem: "CountryDrop",
                  mods: { isArea, isArabic },
                }}
              >
                {this.renderSelectAreaItem()}
              </div>
            )}
          </div>
        </div>
        {/* here we are showing International Shipment tag based on inventory as soon as you select any size of the product*/}
        {(+simple_products?.[sku]?.cross_border_qty && //from this line
          +simple_products?.[sku]?.quantity <=
            +simple_products?.[sku]?.cross_border_qty &&
          +simple_products?.[sku]?.quantity !== 0) || // to this line (including above 2 lines of code) here we are checking for CB inventory
        (actualEddMess?.split(splitKey)?.[1]?.includes("-") && // now from this line of code
          simple_products?.[selectedSizeCode]?.quantity !== 0 && // we are checking when we don't have city/area then range EDD will get displayed then IS tag should also get visible
          !selectedSizeCode) //  but get change as soon as you select any size
          ? this.renderIntlTag()
          : null}
      </div>
    );
  }

  setSize = (sizeType, sizeCode) => {
    this.setState({
      selectedSizeType: sizeType || "eu",
      selectedSizeCode: sizeCode || "",
    });
  };

  setStockAvailability = (status) => {
    const {
      product: { price },
    } = this.props;
    this.setState({ stockAvailibility: !!price && status });
  };

  getBrandUrl = () => {
    const { brandInfoData = '', url_path = ''  } = this.props;
    let finalURLKey = brandInfoData ? brandInfoData : url_path;
    const url = finalURLKey
      .replace(/'/g, "")
      .replace(/[(\s+).&]/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/\-$/, "")
      .replace("@", "at")
      .toLowerCase();
    return `${url}.html`;
  };

  renderBrand() {
    const {
      product: { sku, name, brand_name, gallery_images = [], brandNameclick  },isNewDesign,renderMySignInPopup
    } = this.props;

    const { isArabic } = this.state;
    let gender =
      BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender === "all"
        ? "Men,Women,Kids,Boy,Girl"
        : BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        ? BrowserDatabase.getItem(APP_STATE_CACHE_KEY)?.gender
        : "home";
    if (isArabic) {
      if (gender === "kids") {
        gender = "أولاد,بنات";
      } else if (gender === "all") {
        genderInURL = "أولاد,بنات,نساء,رجال";
      } else {
        if (gender !== "home") {
          gender = getGenderInArabic(gender);
          gender = gender?.replace(
            gender?.charAt(0),
            gender?.charAt(0).toUpperCase()
          );
        }
      }
    } else {
      if (gender === "kids") {
        gender = "Boy,Girl";
      } else if (gender === "all") {
        genderInURL = "Boy,Girl,Men,Women,Kids";
      } else {
        if (gender !== "home") {
          gender = gender?.replace(
            gender?.charAt(0),
            gender?.charAt(0).toUpperCase()
          );
        }
      }
    }
    const url = new URL(window.location.href);
    url.searchParams.append("utm_source", "pdp_share");
    const brandUrlPath = this.props.brandInfoData ? this.props.brandInfoData : this.props.url_path
    const updateNewLink = this.getBrandUrl();
    if (isMobile.any()) {
      return (
        <div block="PDPSummary" elem="Heading">
          <h1  block="PDPSummary" elem="brandName">
            <span block="brandName" elem="title">{brandUrlPath ? (
              gender !== "home" ? (
                <Link
                  className="pdpsummarylinkTagStyle"
                  onClick={ brandNameclick }
                  to={ updateNewLink }
                >
                  {brand_name}
                </Link>
              ) : (
                <Link
                  className="pdpsummarylinkTagStyle"
                  onClick={ brandNameclick }
                  to={ updateNewLink }
                >
                  {brand_name}
                </Link>
              )
            ) : (
              brand_name
            )}</span>{" "}
            {isNewDesign && <PDPBrandFollow renderMySignInPopup={renderMySignInPopup} brand_name={brand_name} sku={sku}  />}
            <span block="PDPSummary" elem="Name">
              {name}
            </span>
          </h1>
        </div>
      );
    }

    return (
      <h1 block="PDPSummary" elem="brandName">
       <span block="brandName" elem="title">{brandUrlPath ? (
          gender !== "home" ? (
            <Link
              className="pdpsummarylinkTagStyle"
              onClick={ brandNameclick }
              to={ updateNewLink }
            >
              {brand_name}
            </Link>
          ) : (
            <Link
              className="pdpsummarylinkTagStyle"
              onClick={ brandNameclick }
              to={ updateNewLink }
            >
              {brand_name}
            </Link>
          )
        ) : (
          brand_name
        )} {isNewDesign && <PDPBrandFollow renderMySignInPopup={renderMySignInPopup} brand_name={brand_name} sku={sku}  />}</span> {" "}
        
        <span block="PDPSummary" elem="Name">
          {name}
        </span>
      </h1>
    );
  }

  renderName() {
    const {
      product: { name },
    } = this.props;

    return (
      <p block="PDPSummary" elem="Name">
        {name}
      </p>
    );
  }

  renderPDPSummaryHeader() {
    const { product } = this.props;
    return (
      <div block="PDPSummary" elem="Header">
        <ProductLabel product={product} section="PDPSummary" />
      </div>
    );
  }

  renderPDPSummaryHeaderAndShareAndWishlistButton() {
    const {
      product: { sku, gallery_images = [] },
      product,
      renderMySignInPopup,
      isNewDesign
    } = this.props;
    const url = new URL(window.location.href);
    url.searchParams.append("utm_source", "pdp_share");

    if (isMobile.any()) {
      return null;
    }

    return (
      <>
        {!isNewDesign && this.renderPDPSummaryHeader()}
        <div block="ShareAndWishlistButtonContainer" className={`${this.state.isArabic ? "isArabic": ""}`}>
          <ShareButton
            title={document.title}
            text={`Hey check this out: ${document.title}`}
            url={url.href}
            image={gallery_images[0] || fallbackImage}
            product={product}
          />

          <WishlistIcon
            sku={sku}
            renderMySignInPopup={renderMySignInPopup}
            data={product}
            pageType="pdp"
          />
        </div>
      </>
    );
  }

  renderPriceAndPDPSummaryHeader() {
    const {
      product: { price, stock_qty, additional_shipping_info },
      edd_info,
      isNewDesign
    } = this.props;
    const { stockAvailibility } = this.state;

    if (!price || stock_qty === 0 || !stockAvailibility) {
      return null;
    }

    return (
      <div block="PriceContainer">
        <Price price={price} renderSpecialPrice={true} pageType="PDPPage" />
        {!isNewDesign && isMobile.any() && this.renderPDPSummaryHeader()}
        {!edd_info || (edd_info && !edd_info.has_cross_border_enabled) && additional_shipping_info ? (
          <span block="AdditionShippingInformation">
            {additional_shipping_info}
          </span>
        ) : null}
      </div>
    );
  }

  renderColors() {
    const {
      product: { colorfamily = "", stock_qty },
    } = this.props;

    if (stock_qty === 0) {
      return null;
    }

    if (!colorfamily) {
      return <div block="PDPSummary" elem="ProductColorBlock" />;
    }

    if (Array.isArray(colorfamily)) {
      return (
        <div block="PDPSummary" elem="ProductColorBlock">
          <strong>{__("Color:")}</strong>
          {colorfamily.map((col) => this.renderColor(col))}
        </div>
      );
    }

    return (
      <div block="PDPSummary" elem="ProductColorBlock">
        <strong>{__("Color:")}</strong>
        {this.renderColor(colorfamily)}
      </div>
    );
  }

  renderColor(color) {
    const engColor = isArabic() ? translateArabicColor(color) : color;
    const fixedColor = engColor.toLowerCase().replace(/ /g, "_");
    const prodColor = SPECIAL_COLORS[fixedColor]
      ? SPECIAL_COLORS[fixedColor]
      : fixedColor;

    return (
      <Fragment key={color}>
        <span
          block="PDPSummary"
          elem="ProductColor"
          style={{ backgroundColor: prodColor }}
        />
        {color}
      </Fragment>
    );
  }

  renderAddToCartSection() {
    const {
      product: { simple_products },
    } = this.props;
    return (
      <>
        {/* <div block="Seperator" /> */}
        <PDPAddToCart
          simple_products={simple_products}
          setStockAvailability={this.setStockAvailability}
          setSize={this.setSize}
          addTag={this.addTag}
        />
      </>
    );
  }

  addTag = (tags) => {
    this.setState({
      tagsFromAddToCart:[...tags]
    });
  }

  renderPDPTags() {
    const {
      product: {
        prod_tag_1,
        prod_tag_2,
        in_stock,
        stock_qty,
        simple_products,
        discountable,
      },
    } = this.props;
    let { selectedSizeCode } = this.state;

    const tags = [prod_tag_1, prod_tag_2].filter(Boolean);

    if (simple_products && Object.keys(simple_products)?.length === 1) {
      selectedSizeCode = Object.keys(simple_products)[0];
    }

    if(this.state.tagsFromAddToCart.length){
      this.state.tagsFromAddToCart.map((tag)=>{
        tags.push(__(tag));
      })
    }

    // Commenting this code, because we are showing this tag other where to with different logic
    // if (
    //   simple_products &&
    //   selectedSizeCode &&
    //   parseInt(simple_products[selectedSizeCode]?.cross_border_qty) ===
    //     parseInt(simple_products[selectedSizeCode]?.quantity) &&
    //   parseInt(simple_products[selectedSizeCode]?.cross_border_qty) > 0
    // ) {
    //   tags.push(__("International Shipment"));
    // }

    // we are hiding Non Discountable based on product requirment 
    // if (discountable?.toLowerCase() === "no") {
    //   tags.push(__("Non Discountable"));
    // }

    if (tags && tags.length) {
      return (
        <>
          {/* {in_stock === 0 && <div block="Seperatortop" />} */}
          <div block="Seperator" mods={{ isDesktop: !isMobile.any() }} />
          <PDPTags tags={tags} />
          {/* <div block="Seperator" /> */}
        </>
      );
    }
    return null;
  }

  renderAvailableItemsSection() {
    const {
      product: { sku },
      isLoading,
      renderMySignInPopup,
    } = this.props;
    const { alsoAvailable } = this.state;
    if (alsoAvailable) {
      if (alsoAvailable.length > 0 && !isLoading) {
        return (
          <div ref={this.alsoAvailableRef}>
            <PDPAlsoAvailable
              productsAvailable={alsoAvailable}
              renderMySignInPopup={renderMySignInPopup}
              productSku={sku}
            />
          </div>
        );
      }
    }

    return null;
  }
  sendImpressions() {
    const {
      product: { sku, name, url },
    } = this.props;
    MOE_trackEvent(EVENT_TABBY_LEARN_MORE_CLICK, {
      country: getCountryFromUrl().toUpperCase(),
      language: getLanguageFromUrl().toUpperCase(),
      product_name: name ? name : "",
      product_sku: sku ? sku : "",
      product_url: url ? url : "",
      app6thstreet_platform: "Web",
    });
    const eventData = {
      name: EVENT_TABBY_LEARN_MORE_CLICK,
      action: EVENT_TABBY_LEARN_MORE_CLICK,
      product_name: name,
      product_id: sku,
    };
    Event.dispatch(EVENT_GTM_PDP_TRACKING, eventData);
  }
  renderTabby() {
    return (
      <>
        <div id="TabbyPromo" onClick={() => this.sendImpressions()}>{this.getTabbyResponse}</div>
      </>
    );
  }

  renderTammaraWidget() {
    const {
      product: { price },
      config: { countries = {} }
    } = this.props;
    const { isArabic, isMobile } = this.state;
    const countryCode = getCountryFromUrl();
    const isTamaraEnable = countries[countryCode]?.isTamaraEnable || false;
    
    if (price && isTamaraEnable) {
      let productPrice = 0;
      const priceObj = Array.isArray(price) ? price[0] : price;
      const [currency, priceData] = Object.entries(priceObj)[0];
      const { default: defPrice } = priceData;
      productPrice = defPrice;

      return (
        <div id="TamaraPromo"> 
          <TamaraWidget 
            isArabic={isArabic}
            countryCode={countryCode}
            productPrice={productPrice}
            isMobile={isMobile}
            currency={currency}
            pageType="pdpPage"
          />
        </div>
      );
    }
  }

  renderIntlTag() {
    return (
      <div block="AdditionShippingInformationInternationalTag">
        {__("International Shipment")}
      </div>
    );
  }

  render() {
    const { isArabic, cityResponse, showCityDropdown, isMobile } = this.state;
    const {
      product: {
        sku,
        name,
        cross_border = 0,
        brand_name = "",
        international_vendor = null,
        timer_start_time,
        timer_end_time,
        simple_products = {},
        size_us = [],
        size_uk = [],
        size_eu = [],
        in_stock,
        stock_qty,
        rating_brand,
        rating_sku,
      },
      edd_info,
      intlEddResponse,
      renderSummary,
      isNewDesign,
    } = this.props;
  
    const AreaOverlay = isMobile && showCityDropdown ? true : false;
    let inventory_level_cross_border = false;
    let cross_border_qty = 0;
    if (typeof simple_products === "object" && simple_products !== null) {
      Object.values(simple_products).forEach((obj) => {
        if (
          parseInt(obj.cross_border_qty) &&
          parseInt(obj.quantity) <= parseInt(obj.cross_border_qty)
        ) {
          inventory_level_cross_border = true;
          cross_border_qty = 1;
        }
      });
    }
    const isIntlBrand =
    cross_border_qty === 1 && edd_info && edd_info.has_cross_border_enabled;
    let outOfStockStatus = false;
    if (size_us && size_uk && size_eu) {
      outOfStockStatus =
        size_us.length === 0 &&
        size_uk.length === 0 &&
        size_eu.length === 0 &&
        in_stock === 0
          ? true
          : in_stock === 1 && stock_qty === 0
          ? true
          : false;
    } else {
      outOfStockStatus =
        in_stock === 0
          ? true
          : in_stock === 1 && stock_qty === 0
          ? true
          : false;
    }

    return (
      <div block="PDPSummary" mods={{ isArabic, AreaOverlay }}>
        {renderSummary.map((sectionName, index) => {
          if(sectionName === "productLabel"){
            return (
              <div block="PDPSummaryHeaderAndShareAndWishlistButtonContainer">
                {this.renderPDPSummaryHeaderAndShareAndWishlistButton()}
              </div>
            )
          }
          if(sectionName === "brandName"){
            
            return (
              <div block="PDPbrandName">
                {this.renderBrand()}
                {isNewDesign && this.renderPDPSummaryHeader()}
              </div> 
            )
          }
          if(sectionName === "priceSummary"){
            return (
              <>
              <div block="PriceAndPDPSummaryHeaderAndTimer">
                <div block="PriceAndPDPSummaryHeader">
                  {this.renderPriceAndPDPSummaryHeader()}
                  {isNewDesign && !isMobile && 
                  <Ratings 
                    className="PDPRatings" 
                    rating_sku={rating_sku} 
                    rating_brand={rating_brand} 
                    productSku={sku}
                    isPDPEventsOnly
                  />
                }
                </div>
                  {
                    !isNewDesign && timer_start_time && timer_end_time && <DynamicContentCountDownTimer start={timer_start_time} end={timer_end_time} isPLPOrPDP />
                  }
              </div>
              </>
            )
          }
          if(sectionName === "shippingInfo"){
            return (
              cityResponse &&
                edd_info &&
                edd_info.is_enable &&
                edd_info.has_pdp &&
                ((isIntlBrand &&
                  Object.keys(intlEddResponse).length > 0 &&
                  !edd_info.has_item_level) ||
                  cross_border_qty === 0 ||
                  (edd_info.has_item_level && isIntlBrand)) &&
                  !outOfStockStatus &&
                this.renderSelectCity(cross_border_qty === 1)
            )
          }
          if(sectionName === 'pdpAddtocart'){
            return this.renderAddToCartSection()
          }
          if(sectionName === 'tamara'){
            return this.renderTammaraWidget()
          }
          if(sectionName === 'tabby'){
            return this.renderTabby();
          }
          if(sectionName === 'pdpTags'){
            return this.renderPDPTags();
          }
          if(sectionName === 'asloAviable'){
            return this.renderAvailableItemsSection();
          }
        })}
        {/* <div block="PDPSummaryHeaderAndShareAndWishlistButtonContainer">
          {this.renderPDPSummaryHeaderAndShareAndWishlistButton()}
        </div>
        {this.renderBrand()}
        {/ * {this.renderName()} * /}
        <div block="PriceAndPDPSummaryHeaderAndTimer">
          <div block="PriceAndPDPSummaryHeader">
            {this.renderPriceAndPDPSummaryHeader()}
          </div>
            {
              timer_start_time && timer_end_time && <DynamicContentCountDownTimer start={timer_start_time} end={timer_end_time} isPLPOrPDP />
            }
        </div>
        {cityResponse &&
          edd_info &&
          edd_info.is_enable &&
          edd_info.has_pdp &&
          ((isIntlBrand &&
            Object.keys(intlEddResponse).length > 0 &&
            !edd_info.has_item_level) ||
            cross_border_qty === 0 ||
            (edd_info.has_item_level && isIntlBrand)) &&
            !outOfStockStatus &&
          this.renderSelectCity(cross_border_qty === 1)}
        {/ * <div block="Seperator" /> * /}
        {/ * { this.renderColors() } * /}
        {this.renderAddToCartSection()}
        {this.renderTammaraWidget()}
        {this.renderTabby()}
        {this.renderPDPTags()}
        {this.renderAvailableItemsSection()} */}
      </div>
    );
  }
}

export default connect(mapStateToProps)(PDPSummary);
