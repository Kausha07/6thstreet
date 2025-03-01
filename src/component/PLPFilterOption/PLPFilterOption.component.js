import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";

import Loader from "Component/Loader";
import Field from "Component/Field";
import { FilterOption } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import { SPECIAL_COLORS, translateArabicColor, arabicTranslatorForExpress } from "Util/Common";
import isMobile from "Util/Mobile";
import { v4 } from "uuid";
import "./PLPFilterOption.style";
import Event,{
  EVENT_MOE_PLP_FILTER,
  EVENT_PLP_SORT,
  EVENT_BRAND_SEARCH_FILTER,
  EVENT_COLOR_SEARCH_FILTER,
  EVENT_SIZES_SEARCH_FILTER,
  EVENT_CATEGORIES_WITHOUT_PATH_SEARCH_FILTER,
  EVENT_DISCOUNT_FILTER_CLICK,
  EVENT_PRICE_FILTER_CLICK,
  EVENT_SORT_BY_DISCOUNT,
  EVENT_SORT_BY_LATEST,
  EVENT_SORT_BY_PRICE_HIGH,
  EVENT_SORT_BY_PRICE_LOW,
  EVENT_SORT_BY_RECOMMENDED,
  EVENT_SET_PREFERENCES_GENDER,
  EVENT_GTM_SORT,
  EVENT_GTM_FILTER,
  MOE_trackEvent
} from "Util/Event";
import { isSignedIn } from "Util/Auth";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";
import { ExpressDeliveryTruck } from "Component/Icons";
import { getAddressType } from "Util/Common/index";

class PLPFilterOption extends PureComponent {
  static propTypes = {
    option: FilterOption.isRequired,
    isRadio: PropTypes.bool,
    defaultFilters: PropTypes.bool,
    parentCallback: PropTypes.func,
    updateFilters: PropTypes.func,
    setDefaultFilters: PropTypes.func,
    toggleOptionList: PropTypes.func,
  };

  static defaultProps = {
    isRadio: false,
    defaultFilters: false,
    parentCallback: () => {},
    updateFilters: () => {},
    setDefaultFilters: () => {},
    toggleOptionList: () => {},
  };

  fieldRef = createRef();

  optionRef = createRef();

  state = {
    isArabic: isArabic(),
    onSelectChecked: false,
    initialFacetKey: "",
    filterSelected: false,
    isLoading:false,
  };

  componentDidMount(){
    if(isMobile?.any()) {
      this.props?.setLoadingMobileFilter(false);
    }
  }

  handleClick = () => {
    const {
      option: { facet_value, facet_key },
      parentCallback,
      toggleOptionList,
      isRadio,
      option,
      OnLevelTwoCategoryPressMsite,
    } = this.props;
    this.setState({ isLoading: true });
    const inputRef = this.optionRef.current.children[0].children[0];
    const { checked } = inputRef;
    const mobileFacetKeys = ["brand_name", "colorfamily", "gender", "in_stock", "size_uk", "size_us", "size_eu", "discount"];
    const isValidFacetKey = facet_key => mobileFacetKeys.includes(facet_key) || facet_key.includes("price");
    const MoeFilterEvent =
      facet_key == "brand_name"
        ? EVENT_BRAND_SEARCH_FILTER
        : facet_key == "colorfamily"
        ? EVENT_COLOR_SEARCH_FILTER
        : facet_key == ("size_eu" || "size_us" || "size_uk")
        ? EVENT_SIZES_SEARCH_FILTER
        : facet_key == "categories_without_path"
        ? EVENT_CATEGORIES_WITHOUT_PATH_SEARCH_FILTER
        : facet_key == "discount"
        ? EVENT_DISCOUNT_FILTER_CLICK
        : facet_key == "gender"
        ? EVENT_SET_PREFERENCES_GENDER
        : facet_key.includes("price")
        ? EVENT_PRICE_FILTER_CLICK
        : "";

    const sendMoeEvents = (event) => {
      MOE_trackEvent(event, {
        country: getCountryFromUrl().toUpperCase(),
        language: getLanguageFromUrl().toUpperCase(),
        app6thstreet_platform: "Web",
      });
    };

    if (checked || isRadio) {
      if (facet_key == "sort") {
        const categorylevelPath =
          localStorage.getItem("CATEGORY_CURRENT") !== null
            ? localStorage.getItem("CATEGORY_CURRENT")
            : "";
        const Categories_level =
          categorylevelPath && categorylevelPath.includes("///")
            ? categorylevelPath.replaceAll(/"/g, "").split("///")
            : [categorylevelPath];
        const checkCategories = Categories_level && Categories_level.length > 0;
        let category_1 = checkCategories ? Categories_level.shift() : "";
        let category_2 = checkCategories ? Categories_level.shift() : "";
        let category_3 = checkCategories ? Categories_level.shift() : "";

        MOE_trackEvent(EVENT_PLP_SORT, {
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          sort_value: facet_value || "",
          ...(category_1 && { category_level_1: category_1 }),
          ...(category_2 && { category_level_2: category_2 }),
          ...(category_3 && { category_level_3: category_3 }),
          plp_name: category_3
            ? category_3
            : category_2
            ? category_2
            : category_1
            ? category_1
            : "",
          app6thstreet_platform: "Web",
        });
        const sortEventType =
          facet_value == __("recommended")
            ? EVENT_SORT_BY_RECOMMENDED
            : facet_value == __("latest")
            ? EVENT_SORT_BY_LATEST
            : facet_value == __("discount")
            ? EVENT_SORT_BY_DISCOUNT
            : facet_value == __("price_low")
            ? EVENT_SORT_BY_PRICE_LOW
            : facet_value == __("price_high")
            ? EVENT_SORT_BY_PRICE_HIGH
            : "";
        if (sortEventType && sortEventType.length > 0) {
          sendMoeEvents(sortEventType);
          Event.dispatch(EVENT_GTM_SORT, sortEventType);
        }
      } else {
        MOE_trackEvent(EVENT_MOE_PLP_FILTER, {
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          filter_type: facet_key || "",
          filter_value: facet_value || "",
          isLoggedIn: isSignedIn(),
          app6thstreet_platform: "Web",
        });
        if (MoeFilterEvent && MoeFilterEvent.length > 0) {
          sendMoeEvents(MoeFilterEvent);
          const EventData = { name: MoeFilterEvent, value: facet_value };
          Event.dispatch(EVENT_GTM_FILTER, EventData);
        }
      }
    }

    if (isMobile.any() && isValidFacetKey(facet_key)) {
      this.props.setLoadingMobileFilter ? this.props.setLoadingMobileFilter(true) : null;
    }

    if(isMobile.any() && facet_key === "categories_without_path") {
      this.props.setLoadingMobileFilter ? this.props.setLoadingMobileFilter(true) : null;
      OnLevelTwoCategoryPressMsite(option, checked)
    }else {
      parentCallback(facet_key, facet_value, checked, isRadio);
    }
    if (facet_key === "sort") {
      toggleOptionList();
    }
  };

  renderField() {
    const {
      option: { facet_value, is_selected: checked, facet_key },
      isRadio,
    } = this.props;
    const { onSelectChecked } = this.state;

    // TODO: fix radio ?
    const type = isRadio ? "radio" : "checkbox";

    return (
      <Field
        formRef={this.fieldRef}
        onClick={this.handleClick}
        mix={{
          block: "PLPFilterOption",
          elem: "Input",
        }}
        type={type}
        id={facet_value + facet_key}
        name={facet_key}
        value={facet_value}
        checked={checked}
      />
    );
  }

  renderMobileField(facet_value, facet_key, checked) {
    const { isRadio, updateFilters, setDefaultFilters, defaultFilters } =
      this.props;

    const defaultCheck = !!(
      facet_value === "recommended" && facet_key === "sort"
    );
    const type = isRadio ? "radio" : "checkbox";

    if (!defaultFilters && defaultCheck) {
      updateFilters();
      setDefaultFilters();
    }

    return (<>
    
      <Loader isLoading={this.props.isLoadingFilter} />
      <Field
        formRef={this.fieldRef}
        onClick={this.handleClick}
        mix={{
          block: "PLPFilterOption",
          elem: "Input",
          mods: { isArabic: isArabic() },
        }}
        type={type}
        id={facet_value + facet_key}
        name={facet_key}
        value={facet_value}
        defaultCheck={defaultCheck || checked}
        checked={defaultCheck || checked}
      />
    </>
    );
  }

  renderCount() {
    const {
      option: { product_count, facet_key, productCountMsite = 0 },
    } = this.props;

    if (isMobile.any() && facet_key === "categories_without_path") {
      return <span>{`(${productCountMsite})`}</span>;      
    }

    return <span>{`(${product_count})`}</span>;
  }

  renderLabel() {
    const {
      option: { label = "", facet_value, facet_key, product_count, productCountMsite },
      isExpressDelivery, vwoData,
      mailing_address_type,
    } = this.props;
    const finalProductCount = product_count ? product_count : productCountMsite;

    if (!label) {
      return null;
    }

    if (facet_key === "colorfamily") {
      const engColor = isArabic() ? translateArabicColor(label) : label;
      const fixedColor = engColor.toLowerCase().replace(/ /g, "_");
      const newColors = {
        Ivory: "ivory",
        Rose: "rose",
        Fuchsia: "fuchsia",
        Magenta: "magenta",
        Mauve: "mauve",
        Mint: "mint",
        "Navy Blue": "navy blue",
        Sand: "sand",
        Teal: "teal",
        Transparent: "transparent",
        Wine: "wine",
        Coral: "coral",
        Khaki: "khaki",
        "Light Honey": "light honey",
        "Fancy Rose": "fancy rose",
        "Naughty Mauve": "Naughty Mauve",
        "Pretty Kiss": "Pretty Kiss",
        "Stay Currant": "stay currant",
        "Ultimate Wine": "ultimate wine",
        Chocolate: "chocolate",
        Multicolour: "Multicolour",
        Raspberry: "Raspberry",
        Addiction: "addiction",
        Almond: "almond",
        Berry: "berry",
        Caramel: "caramel",
        "Everlasting Rum": "everlasting rum",
        "Fancy Rose": "fancy rose",
        "Forever Scarlet": "forever scarlet",
        Heather: "heather",
        Leopard: "leopard",
        Light: "light",
        Mahogany: "mahogany",
        Passion: "passion",
        "Pink Sapphire": "pink sapphire",
        Plum: "plum",
        Porcelain: "porcelain",
        Twilight: "twilight",
        Lightbeige: "Lightbeige",
      };
      const color = SPECIAL_COLORS[fixedColor]
        ? SPECIAL_COLORS[fixedColor]
        : fixedColor;

      return (
        <label block="PLPFilterOption" htmlFor={facet_value}>
          {isArabic() && isMobile.any() ? label : null}
          <span
            block="PLPFilterOption"
            elem="Color"
            style={{ backgroundColor: color }}
          />
          {isArabic() && !isMobile.any()
            ? (!newColors[label])
              ? label
              : translateArabicColor(label)
            : null}
          {!isArabic()
              ? label
            : null}
          {product_count && this.renderCount()}
        </label>
      );
    }

    if (facet_key === `express_delivery_${getAddressType(mailing_address_type)}` && isExpressDelivery && vwoData?.Express?.isFeatureEnabled) {
      let finalLabel = label;
      const words = label?.split(" ");
      if (words?.length > 1) {
        finalLabel = `${words?.[0]}`;
      }

      if(isArabic()) {
        if (words?.length > 1) {
          finalLabel = `${words?.[1]}`;
        }
      }

      return (
        <label block="PLPFilterOption" htmlFor={facet_value}>
          <ExpressDeliveryTruck style={{ height: "24px", width: "24px" }} />
          <span
            style={{
              color: "#f96446",
              "font-weight": "600",
              "font-style": "italic",
            }}
          >
            {__("Express")}
          </span>
          <span>{finalLabel}</span>
          {product_count && this.renderCount()}
        </label>
      );
    }

    return (
      <label block="PLPFilterOption" htmlFor={facet_value}>
        {label}
        {finalProductCount && this.renderCount()}
      </label>
    );
  }

  render() {
    const { isArabic } = this.state;
    const {
      option: { facet_value, facet_key, is_selected: checked },
    } = this.props;
    if (!facet_value) {
      return null;
    }
    return (
      <>
        <Loader isLoading={this.props.isLoadingFilter} />
        <li
          key={v4()}
          ref={this.optionRef}
          block="PLPFilterOption"
          elem="List"
          mods={{ isArabic }}
        >
          {isMobile.any() &&
            this.renderMobileField(facet_value, facet_key, checked)}
          {!isMobile.any() && this.renderField()}
          {this.renderLabel()}
        </li>
      </>
    );
  }
}

export default PLPFilterOption;
