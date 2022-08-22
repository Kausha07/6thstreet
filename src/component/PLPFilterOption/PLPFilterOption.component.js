import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";

import Field from "Component/Field";
import { FilterOption } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import { SPECIAL_COLORS, translateArabicColor } from "Util/Common";
import isMobile from "Util/Mobile";
import { v4 } from "uuid";
import "./PLPFilterOption.style";
import {
  EVENT_MOE_PLP_FILTER,
  EVENT_MOE_PLP_SORT,
  EVENT_MOE_BRAND_SEARCH_FILTER,
  EVENT_MOE_COLOR_SEARCH_FILTER,
  EVENT_MOE_SIZES_SEARCH_FILTER,
  EVENT_MOE_CATEGORIES_WITHOUT_PATH_SEARCH_FILTER,
  EVENT_MOE_DISCOUNT_FILTER_CLICK,
  EVENT_MOE_PRICE_FILTER_CLICK,
  EVENT_MOE_SORT_BY_DISCOUNT,
  EVENT_MOE_SORT_BY_LATEST,
  EVENT_MOE_SORT_BY_PRICE_HIGH,
  EVENT_MOE_SORT_BY_PRICE_LOW,
  EVENT_MOE_SORT_BY_RECOMMENDED,
  EVENT_MOE_SET_PREFERENCES_GENDER,
} from "Util/Event";
import { getCountryFromUrl, getLanguageFromUrl } from "Util/Url";

class PLPFilterOption extends PureComponent {
  static propTypes = {
    option: FilterOption.isRequired,
    isRadio: PropTypes.bool,
    defaultFilters: PropTypes.bool,
    parentCallback: PropTypes.func,
    updateFilters: PropTypes.func,
    setDefaultFilters: PropTypes.func,
  };

  static defaultProps = {
    isRadio: false,
    defaultFilters: false,
    parentCallback: () => {},
    updateFilters: () => {},
    setDefaultFilters: () => {},
  };

  fieldRef = createRef();

  optionRef = createRef();

  state = {
    isArabic: isArabic(),
    onSelectChecked: false,
    initialFacetKey: "",
    filterSelected: false,
  };

  handleClick = () => {
    const {
      option: { facet_value, facet_key },
      parentCallback,
      isRadio,
    } = this.props;
    const inputRef = this.optionRef.current.children[0].children[0];
    const { checked } = inputRef;
    const MoeFilterEvent =
      facet_key == "brand_name"
        ? EVENT_MOE_BRAND_SEARCH_FILTER
        : facet_key == "colorfamily"
        ? EVENT_MOE_COLOR_SEARCH_FILTER
        : facet_key == ("size_eu" || "size_us" || "size_uk")
        ? EVENT_MOE_SIZES_SEARCH_FILTER
        : facet_key == "categories_without_path"
        ? EVENT_MOE_CATEGORIES_WITHOUT_PATH_SEARCH_FILTER
        : facet_key == "discount"
        ? EVENT_MOE_DISCOUNT_FILTER_CLICK
        : facet_key == "gender"
        ? EVENT_MOE_SET_PREFERENCES_GENDER
        : facet_key.includes("price")
        ? EVENT_MOE_PRICE_FILTER_CLICK
        : "";

    const sendMoeEvents = (event) => {
      Moengage.track_event(event, {
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
        console.log("CATEGORY", category_1, category_2, category_3);
        Moengage.track_event(EVENT_MOE_PLP_SORT, {
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
          facet_value == "recommended"
            ? EVENT_MOE_SORT_BY_RECOMMENDED
            : facet_value == "latest"
            ? EVENT_MOE_SORT_BY_LATEST
            : facet_value == "discount"
            ? EVENT_MOE_SORT_BY_DISCOUNT
            : facet_value == "price_low"
            ? EVENT_MOE_SORT_BY_PRICE_LOW
            : facet_value == "price_high"
            ? EVENT_MOE_SORT_BY_PRICE_HIGH
            : "";
        if (sortEventType && sortEventType.length > 0) {
          sendMoeEvents(sortEventType);
        }
      } else {
        Moengage.track_event(EVENT_MOE_PLP_FILTER, {
          country: getCountryFromUrl().toUpperCase(),
          language: getLanguageFromUrl().toUpperCase(),
          filter_type: facet_key || "",
          filter_value: facet_value || "",
          app6thstreet_platform: "Web",
        });
        if (MoeFilterEvent && MoeFilterEvent.length > 0) {
          sendMoeEvents(MoeFilterEvent);
        }
      }
    }
    parentCallback(facet_key, facet_value, checked, isRadio);
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
    return (
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
    );
  }

  renderCount() {
    const {
      option: { product_count },
    } = this.props;

    return <span>{`(${product_count})`}</span>;
  }

  renderLabel() {
    const {
      option: { label = "", facet_value, facet_key, product_count },
    } = this.props;

    if (!label) {
      return null;
    }

    if (facet_key === "colorfamily") {
      const engColor = isArabic() ? translateArabicColor(label) : label;
      const fixedColor = engColor.toLowerCase().replace(/ /g, "_");
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
          {isArabic() && !isMobile.any() ? label : null}
          {!isArabic() ? label : null}
          {product_count && this.renderCount()}
        </label>
      );
    }

    return (
      <label block="PLPFilterOption" htmlFor={facet_value}>
        {label}
        {product_count && this.renderCount()}
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
    );
  }
}

export default PLPFilterOption;
