import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";

import Field from "Component/Field";
import { FilterOption } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import { SPECIAL_COLORS, translateArabicColor } from "Util/Common";
import isMobile from "Util/Mobile";

import "./PLPFilterOption.style";

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

  componentDidMount() {
    const {
      option: { facet_key },
    } = this.props;

    this.setState({ initialFacetKey: facet_key });
  }

  handleClick = () => {
    const {
      option: { facet_value },
      parentCallback,
      isRadio,
    } = this.props;
    const { initialFacetKey } = this.state;
    const inputRef = this.optionRef.current.children[0].children[0];
    const { checked } = inputRef;

    parentCallback(initialFacetKey, facet_value, checked, isRadio);
  };

  renderField() {
    const {
      option: { facet_value, is_selected: checked },
      isRadio,
    } = this.props;
    const { onSelectChecked, initialFacetKey } = this.state;

    // TODO: fix radio ?
    const type = isRadio ? "radio" : "checkbox";

    if (isMobile.any()) {
      return this.renderMobileField(
        facet_value,
        initialFacetKey,
        checked,
        onSelectChecked
      );
    }

    return (
      <Field
        formRef={this.fieldRef}
        onClick={this.handleClick}
        mix={{
          block: "PLPFilterOption",
          elem: "Input",
        }}
        type={type}
        id={facet_value + initialFacetKey}
        name={initialFacetKey}
        value={facet_value}
        checked={checked}
      />
    );
  }

  renderMobileField(facet_value, initialFacetKey, checked, onSelectChecked) {
    const { isRadio, updateFilters, setDefaultFilters, defaultFilters } =
      this.props;

    const defaultCheck = !!(
      facet_value === "recommended" && initialFacetKey === "sort"
    );
    const type = isRadio ? "radio" : "checkbox";

    if (!defaultFilters && defaultCheck) {
      this.handleClick();
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
        id={facet_value + initialFacetKey}
        name={initialFacetKey}
        value={facet_value}
        defaultCheck={defaultCheck || checked || onSelectChecked}
        checked={defaultCheck || checked || onSelectChecked}
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
          {product_count && !isMobile.any() ? this.renderCount() : null}
        </label>
      );
    }

    return (
      <label block="PLPFilterOption" htmlFor={facet_value}>
        {label}
        {product_count && !isMobile.any() ? this.renderCount() : null}
      </label>
    );
  }

  render() {
    const { isArabic } = this.state;
    const {
      option: { facet_value },
    } = this.props;
    if (!facet_value) {
      return null;
    }
    return (
      <li
        ref={this.optionRef}
        block="PLPFilterOption"
        elem="List"
        mods={{ isArabic }}
      >
        {this.renderField()}
        {this.renderLabel()}
      </li>
    );
  }
}

export default PLPFilterOption;
