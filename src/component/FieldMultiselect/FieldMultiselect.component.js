/* eslint-disable react/jsx-no-bind */
import PLPFilterOption from "Component/PLPFilterOption";
import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";
import { Filter } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import "./FieldMultiselect.style";
import Image from "Component/Image";
import selectedImage from "./icons/select.png";
import selectImage from "./icons/add.png";
import searchPng from "../HeaderSearch/icons/search.svg";
import Field from "Component/Field";

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

  allFieldRef = createRef();

  allOptionRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      toggleOptionsList: false,
      isArabic: isArabic(),
      subcategoryOptions: {},
      parentActiveFilters: null,
      currentActiveFilter: null,
      searchList: {},
      searchKey: "",
      searchFacetKey: "",
      sizeDropDownList: {},
      sizeDropDownKey: "",
      showMore: false,
    };
    this.toggelOptionList = this.toggelOptionList.bind(this);
    this.handleFilterSearch = this.handleFilterSearch.bind(this);
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

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.parentActiveFilters) !==
      JSON.stringify(this.props.parentActiveFilters)
    ) {
      this.setState({
        parentActiveFilters: this.props.parentActiveFilters,
      });
    }
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
      parentActiveFilters,
      currentActiveFilter,
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
        currentActiveFilter={currentActiveFilter}
        isChecked={isChecked}
        parentActiveFilters={parentActiveFilters}
        parentCallback={parentCallback}
        updateFilters={updateFilters}
        setDefaultFilters={setDefaultFilters}
        defaultFilters={defaultFilters}
      />
    );
  };

  handleSizeSelection = (e) => {
    const { parentCallback } = this.props;
    const { id: facet_key } = e.target;
    const facet_value = e.target.getAttribute("name");
    const checked = e.target.getAttribute("value") === "false" ? true : false;
    parentCallback(facet_key, facet_value, checked, false);
  };

  renderSizeOption = ([key, option = {}]) => {
    const { subcategories = {} } = option;
    const thisRef = this;
    if (key === this.state.sizeDropDownKey) {
      return Object.values(subcategories).map(function (value, index) {
        const { facet_key, facet_value } = value;
        return (
          <div
            block="FieldMultiselect"
            elem="sizesOption"
            mods={{ selectedSize: value.is_selected }}
            key={index}
            id={facet_key}
            name={facet_value}
            value={value.is_selected}
            onClick={(e) => thisRef.handleSizeSelection(e)}
          >
            {value.label}
            {!value.is_selected ? (
              <Image lazyLoad={false} src={selectImage} alt="fitler" />
            ) : (
              <Image lazyLoad={false} src={selectedImage} alt="fitler" />
            )}
          </div>
        );
      });
    }
  };

  renderUnselectButton(category) {
    return (
      <div
        block="FieldMultiselect"
        elem="SizeSelector"
        onClick={() => this.onDeselectAllCategory(category)}
      >
        Unselect All
      </div>
    );
  }

  onDeselectAllCategory = (category) => {
    const { onUnselectAllPress } = this.props;
    onUnselectAllPress(category);
  };

  getSizeTypeSelect(sizeObject) {
    const { sizeDropDownKey } = this.state;

    return (
      <div block="FieldMultiselect" elem="SizeTypeSelector">
        <select
          key="SizeTypeSelect"
          block="FieldMultiselect"
          elem="SizeTypeSelectElement"
          value={sizeDropDownKey}
          onChange={this.handleSizeDropDownClick}
        >
          {sizeObject.map((size = "") => {
            return (
              <option
                key={size.key}
                block="FieldMultiselect"
                elem="SizeTypeOption"
                value={size.key}
              >
                {size.value.toUpperCase()}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  renderSizeDropDown(sizeObject = []) {
    return (
      <div block="FieldMultiselect" elem="SizeSelect">
        {this.renderUnselectButton("sizes")}
        {this.getSizeTypeSelect(sizeObject)}
      </div>
    );
  }

  handleSizeDropDownClick = (e) => {
    e.preventDefault();
    this.setState({
      sizeDropDownKey: e.target.value,
    });
  };

  renderOptions() {
    const {
      filter: {
        data = {},
        subcategories = {},
        category,
        is_radio,
        label,
        selected_filters_count,
      },
      initialOptions,
    } = this.props;
    const { searchFacetKey, searchKey, searchList } = this.state;
    let finalData = data ? data : subcategories;
    let totalCount = 0;
    if (!is_radio) {
      if (data && category !== "categories_without_path") {
        Object.values(data).map((category) => {
          totalCount = totalCount + category.product_count;
        });
      } else {
        let categoryLevel1 = initialOptions.q.split(" ")[1];
        if (data[categoryLevel1]) {
          let filterData = data[categoryLevel1].subcategories;
          Object.values(filterData).map((category) => {
            totalCount = totalCount + category.product_count;
          });
        }
      }
    }

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

    let sizeData = data;
    if (this.state.sizeDropDownKey === "" && category === "sizes") {
      this.setState({
        sizeDropDownKey: "size_eu",
        sizeDropDownList: data,
      });
    }

    let searchData = data;
    if (searchKey != "" && searchFacetKey === category) {
      searchData = searchList;
    }
    const type = is_radio ? "radio" : "checkbox";
    const selectAllCheckbox = selected_filters_count === 0 ? true : false;
    return (
      <>
        <ul
          block="FieldMultiselect"
          elem={category === "sizes" ? "sizesOptionContainer" : ""}
        >
          {!is_radio &&
            category !== "sizes" &&
            this.renderAllFilterOption(
              type,
              category,
              selectAllCheckbox,
              totalCount
            )}
          {category === "in_stock"
            ? Object.entries(finalData).map(this.renderOption)
            : category === searchFacetKey
            ? Object.entries(searchData).map(this.renderOption)
            : category === "sizes" && !isMobile.any()
            ? Object.entries(sizeData).map(this.renderSizeOption)
            : Object.keys(data).length
            ? Object.entries(data).map(this.renderOption)
            : Object.entries(subcategories).map(this.renderOption)}
        </ul>
      </>
    );
  }

  renderAllFilterOption(type, initialFacetKey, checked, totalCount) {
    let product_count = totalCount;
    const { isArabic } = this.state;
    return (
      <li
        ref={this.allOptionRef}
        block="PLPFilterOption"
        elem="List"
        mods={{ isArabic }}
      >
        <Field
          formRef={this.allFieldRef}
          onClick={() => {}}
          mix={{
            block: "PLPFilterOption",
            elem: "Input",
          }}
          type={type}
          id={"all" + initialFacetKey}
          name={initialFacetKey}
          value={"all"}
          checked={checked}
        />
        <label block="PLPFilterOption" htmlFor={"all"}>
          All
          {!isMobile.any() && <span>{`(${product_count})`}</span>}
        </label>
      </li>
    );
  }

  renderFilterSearchbox(label, category) {
    let placeholder = label
      ? label
      : `${category.charAt(0).toUpperCase()}${
          category.split(category.charAt(0))[1]
        }`;
    const { isArabic } = this.state;
    return (
      <div block="Search-Container">
        <input
          type="text"
          id={category}
          placeholder={isMobile.any() ? "Search..." : `Search ${placeholder}`}
          onChange={(event) => this.handleFilterSearch(event)}
        />
        {!isMobile.any() && (
          <button
            block="FilterSearch"
            elem="SubmitBtn"
            mods={{ isArabic }}
            type="submit"
          >
            <Image lazyLoad={false} src={searchPng} alt="search" />
          </button>
        )}
      </div>
    );
  }

  handleFilterSearch(event) {
    const {
      filter: { data = {} },
      initialOptions,
    } = this.props;
    const facet_key = event.target.id;
    let allData = data ? data : null;
    let value = event.target.value;
    let finalSearchedData = {};
    if (facet_key === "categories_without_path") {
      let categoryLevel1 = initialOptions.q.split(" ")[1];
      let categoryData = data[categoryLevel1].subcategories;
      Object.keys(categoryData).filter((key) => {
        if (key.toLowerCase().includes(value.toLowerCase())) {
          finalSearchedData[key] = categoryData[key];
        }
      });
    } else {
      Object.keys(allData).filter((key) => {
        if (key.toLowerCase().includes(value.toLowerCase())) {
          finalSearchedData[key] = allData[key];
        }
      });
    }

    if (finalSearchedData) {
      this.setState({
        searchList: finalSearchedData,
        searchKey: value,
        searchFacetKey: facet_key,
      });
    }
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

  renderOptionSelected() {
    const {
      filter: { data },
    } = this.props;
    const { showMore } = this.state;
    if (this.props.isSortBy) {
      return null;
    }
    if (data) {
      return (
        <div block="MultiSelectOption">
          <ul block="selectedOptionLists">
            {Object.values(data).map(function (values, keys) {
              if (values.subcategories) {
                return Object.values(values.subcategories).map(function (
                  val,
                  key
                ) {
                  if (val.is_selected === true) {
                    let label =
                      val.facet_key === "in_stock" && val.label === 1
                        ? "In Stock"
                        : val.facet_key === "in_stock" && val.label === 0
                        ? "Out of Stock"
                        : val.label;
                    return (
                      <>
                        <li key={key} block="selectedListItem">
                          {label}
                        </li>
                        {showMore ? (
                          <div block="PDPDetailWrapper" elem="Button">
                            <button
                              onClick={() => this.updateShowMoreState(false)}
                            >
                              {__("SHOW MORE")}
                            </button>
                          </div>
                        ) : null}
                      </>
                    );
                  }
                });
              } else {
                if (values.is_selected === true) {
                  let label =
                    values.facet_key === "in_stock" && values.label === "1"
                      ? "In Stock"
                      : values.facet_key === "in_stock" && values.label === "0"
                      ? "Out of Stock"
                      : values.label;
                  return (
                    <>
                      <li key={keys} block="selectedListItem">
                        {label}
                      </li>
                      {showMore ? (
                        <div block="PDPDetailWrapper" elem="Button">
                          <button
                            onClick={() => this.updateShowMoreState(false)}
                          >
                            {__("SHOW MORE")}
                          </button>
                        </div>
                      ) : null}
                    </>
                  );
                }
              }
            })}
          </ul>
        </div>
      );
    }
  }

  updateShowMoreState = (state) => {
    this.setState({ showMore: state });
  };

  // showMoreText = () => {
  //   // Get all the elements from the page
  //   var points = document.getElementById("points");
  //   var showMoreText = document.getElementById("moreText");
  //   var buttonText = document.getElementById("textButton");
  //   if (points.style.display === "none") {
  //     showMoreText.style.display = "none";
  //     points.style.display = "inline";
  //     buttonText.innerHTML = "Show More";
  //   }
  //   else {
  //     showMoreText.style.display = "inline";
  //     points.style.display = "none";
  //     buttonText.innerHTML = "Show Less";
  //   }
  // };

  renderMultiselectContainer() {
    const { toggleOptionsList, isArabic } = this.state;
    const {
      placeholder,
      isHidden,
      filter: { data = {}, subcategories = {}, category, is_radio, label },
      initialOptions,
    } = this.props;

    const datakeys = [];
    if (category === "sizes") {
      Object.keys(data).map((key) => {
        datakeys.push({ key: key, value: data[key].label.split(" ")[1] });
      });
    }
    let conditionalData = data ? data : subcategories;

    if (category === "categories_without_path") {
      let categoryLevel1 = initialOptions.q.split(" ")[1];
      if (data[categoryLevel1]) {
        conditionalData = data[categoryLevel1].subcategories;
      }
    }
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
        {isMobile.any() ? null : this.renderOptionSelected()}
        {toggleOptionsList && !isMobile.any() && (
          <>
            {/* {Object.keys(conditionalData).length > 10
              ? this.renderFilterSearchbox(label, category)
              : null} */}
            {category === "sizes" && !isMobile.any()
              ? this.renderSizeDropDown(datakeys)
              : null}
            {category !== "sizes" &&
              !isMobile.any() &&
              !is_radio &&
              this.renderUnselectButton(category)}
          </>
        )}
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
          {isMobile.any() && Object.keys(conditionalData).length > 10
            ? this.renderFilterSearchbox(label, category)
            : null}
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
