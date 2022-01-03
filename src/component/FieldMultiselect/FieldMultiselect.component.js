/* eslint-disable react/jsx-no-bind */
import PLPFilterOption from "Component/PLPFilterOption";
import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";
import { Filter } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import "./FieldMultiselect.style";

class FieldMultiselect extends PureComponent {
  static propTypes = {
    filter: Filter.isRequired,
    placeholder: PropTypes.string,
    activeFilter: PropTypes.object,
    isChecked: PropTypes.bool,
    changeActiveFilter: PropTypes.func,
    currentActiveFilter: PropTypes.string,
    isHidden: PropTypes.bool,
    defaultFilters: PropTypes.bool,
    parentCallback: PropTypes.func,
    setDefaultFilters: PropTypes.func,
    updateFilters: PropTypes.func,
  };

  static defaultProps = {
    placeholder: "",
    activeFilter: {},
    isChecked: false,
    currentActiveFilter: "",
    isHidden: false,
    defaultFilters: false,
    parentCallback: () => {},
    changeActiveFilter: () => {},
    updateFilters: () => {},
    setDefaultFilters: () => {},
  };

  filterDropdownRef = createRef();

  filterButtonRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      toggleOptionsList: false,
      isArabic: isArabic(),
      subcategoryOptions: {},
    };
    this.toggelOptionList = this.toggelOptionList.bind(this);
  }

  static getDerivedStateFromProps(props) {
    if (isMobile.any()) {
      const { currentActiveFilter, filter } = props;

      return {
        toggleOptionsList: currentActiveFilter === filter.category,
      };
    }

    return null;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    const { toggleOptionsList } = this.state;

    if (toggleOptionsList) {
      if (
        this.filterDropdownRef &&
        !this.filterDropdownRef.current.contains(event.target)
      ) {
        this.onBlur();
      }
    }
  };

  renderSubcategoryOptions = (option = {}, display) => {
    const { isArabic } = this.state;
    const { subcategories = {} } = option;

    return (
      <div
        block="FieldMultiselect"
        elem="MobileOptionList"
        mods={{ isArabic }}
        style={{ display }}
      >
        {Object.entries(subcategories).map(this.renderOption)}
      </div>
    );
  };

  handleSubcategoryClick = (option) => {
    const { subcategoryOptions } = this.state;
    // const subcategoryOptionsValues = this.renderSubcategoryOptions(option);

    if (
      !subcategoryOptions[option.label] ||
      subcategoryOptions[option.label] === undefined
    ) {
      this.setState({
        subcategoryOptions: {
          ...subcategoryOptions,
          [option.label]: true,
        },
      });
    } else {
      this.setState({
        subcategoryOptions: {
          ...subcategoryOptions,
          [option.label]: false,
        },
      });
    }
  };

  renderOptionMobile = (option) => {
    const { subcategoryOptions, isArabic } = this.state;

    const isClosed =
      !subcategoryOptions[option.label] ||
      subcategoryOptions[option.label] === undefined;
    const display = isClosed ? "none" : "block";

    return (
      <div block="FieldMultiselect" elem="MobileOptions">
        <button
          block="FieldMultiselect"
          elem="MobileOptionButton"
          mods={{
            isClosed,
          }}
          mix={{
            block: "FieldMultiselect",
            elem: "MobileOptionButton",
            mods: { isArabic },
          }}
          onClick={() => this.handleSubcategoryClick(option)}
        >
          {option.label}
        </button>
        {this.renderSubcategoryOptions(option, display)}
      </div>
    );
  };

  renderOption = ([key, option = {}]) => {
    const {
      filter: { is_radio },
      activeFilter,
      isChecked,
      parentCallback,
      updateFilters,
      setDefaultFilters,
      defaultFilters,
    } = this.props;
    const { subcategories = {} } = option;

    if (Object.keys(subcategories).length !== 0) {
      return !isMobile.any()
        ? Object.entries(subcategories).map(this.renderOption)
        : this.renderOptionMobile(option);
    }
    return (
      <PLPFilterOption
        key={key}
        option={option}
        isRadio={is_radio}
        activeFilter={activeFilter}
        isChecked={isChecked}
        parentCallback={parentCallback}
        updateFilters={updateFilters}
        setDefaultFilters={setDefaultFilters}
        defaultFilters={defaultFilters}
      />
    );
  };

  renderOptions() {
    const {
      filter: { data = {}, subcategories = {}, category },
    } = this.props;
    let finalData = data ? data : subcategories;
    if (category === "in_stock") {
      if (finalData) {
        Object.values(finalData).map((subData) => {
          if (subData.facet_value === "0") {
            return (subData.label = __("Out of Stock"));
          } else if (subData.facet_value === "1") {
            return (subData.label = __("In Stock"));
          }
        });
      }
    }
    return (
      <ul>
        {category === "in_stock"
          ? Object.entries(finalData).map(this.renderOption)
          : Object.keys(data).length
          ? Object.entries(data).map(this.renderOption)
          : Object.entries(subcategories).map(this.renderOption)}
      </ul>
    );
  }

  onCheckboxOptionClick = () => {
    this.filterButtonRef.current.focus();

    this.setState({
      toggleOptionsList: false,
    });
  };

  handleFilterChange = () => {
    const { changeActiveFilter, filter } = this.props;
    changeActiveFilter(filter.category || filter.facet_key);
  };

  toggelOptionList() {
    const { toggleOptionsList } = this.state;

    this.setState({
      toggleOptionsList: !toggleOptionsList,
    });
  }

  onBlur = () => {
    // eslint-disable-next-line no-magic-numbers
    this.toggelOptionList();
  };

  renderMultiselectContainer() {
    const { toggleOptionsList, isArabic } = this.state;
    const { placeholder, isHidden } = this.props;
    return (
      <div
        ref={this.filterDropdownRef}
        block="FieldMultiselect"
        mods={{ isHidden }}
      >
        <button
          ref={this.filterButtonRef}
          type="button"
          block="FieldMultiselect"
          elem="FilterButton"
          mods={{ toggleOptionsList }}
          mix={{
            block: "FieldMultiselect",
            elem: "FilterButton",
            mods: { isArabic },
          }}
          onClick={
            isMobile.any() ? this.handleFilterChange : this.toggelOptionList
          }
        >
          {placeholder}
        </button>
        <div
          block="FieldMultiselect"
          elem="OptionListContainer"
          mods={{ toggleOptionsList }}
          mix={{
            block: "FieldMultiselect",
            elem: "OptionListContainer",
            mods: { isArabic },
          }}
        >
          <fieldset block="PLPFilter">{this.renderOptions()}</fieldset>
        </div>
      </div>
    );
  }

  render() {
    return this.renderMultiselectContainer();
  }
}

export default FieldMultiselect;
