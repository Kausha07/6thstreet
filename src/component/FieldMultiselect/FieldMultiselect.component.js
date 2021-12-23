/* eslint-disable react/jsx-no-bind */
import PLPFilterOption from "Component/PLPFilterOption";
import PropTypes from "prop-types";
import { createRef, PureComponent } from "react";
import { Filter } from "Util/API/endpoint/Product/Product.type";
import { isArabic } from "Util/App";
import isMobile from "Util/Mobile";
import "./FieldMultiselect.style";
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
    parentCallback: () => { },
    changeActiveFilter: () => { },
    updateFilters: () => { },
    setDefaultFilters: () => { },
  };

  filterDropdownRef = createRef();

  filterButtonRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      toggleOptionsList: false,
      isArabic: isArabic(),
      subcategoryOptions: {},
      brandList: {},
      brandSearchKey: "",
      sizeDropDownList: {},
      sizeDropDownKey: "",

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

  renderSizeOption = ([key, option = {}]) => {
    const { subcategories = {} } = option;
    if (key === this.state.sizeDropDownKey) {
      return Object.values(subcategories).map(function (value) {

        return <h3>{value.label}</h3>
      })
    }
  }
  renderSizesDropdown(sizesdrops) {
    const thisref = this;
    return (
      <>
        <div block="sizesDropDown">
          <button>{this.state.sizeDropDownKey}</button>
        </div>

        <div>
          {
            sizesdrops.map(function (data) {
              return (
                <div key={data.key}>
                  <button onClick={(e) => { thisref.handleSizeDropDownClick(e, data.key) }} id={data.key}>{data.value}</button>
                </div>
              )
            })
          }
        </div>
      </>
    )
  }
  handleSizeDropDownClick = (e, key) => {
    e.preventDefault();
    const {filter: { data = {} }} = this.props;
    this.setState({
      sizeDropDownKey: key
    })
  }

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
    let brandSearchData = data;
    if (category === "brand_name") {
      if (this.state.brandSearchKey != "") {
        brandSearchData = this.state.brandList
      }
    }
    let sizeData = data;
    if (this.state.sizeDropDownKey == "" ) {
      this.setState({
        sizeDropDownKey: "size_eu",
        sizeDropDownList: data
      })
    }
    
    
    const datakeys = [];
    if (category === "sizes") {            
      Object.keys(data).map((key) => {
        datakeys.push({ "key": key, "value": data[key].label })
      })      
      // if (this.state.sizeDropDownKey != "") {
      //   sizeData = this.state.sizeDropDownList
      // }
    }
    return (
      <>
        {category === "brand_name" ? this.renderFilterSearchbox() : null}
        {category === "sizes" && !isMobile.any() ? this.renderSizesDropdown(datakeys) : null}
        <ul>
          {
            category === "in_stock" ? Object.entries(finalData).map(this.renderOption) :
              category === "brand_name" ? Object.entries(brandSearchData).map(this.renderOption) :
                category === "sizes" && !isMobile.any() ? Object.entries(sizeData).map(this.renderOption) :
                  Object.keys(data).length ? Object.entries(data).map(this.renderOption) :
                    Object.entries(subcategories).map(this.renderOption)
          }
        </ul>
      </>
    );
  }



  renderFilterSearchbox() {
    return (
      <input type="text" onChange={(event) => this.handleFilterSearch(event)} />
    )
  }

  handleFilterSearch(event) {
    const { filter: { data = {} } } = this.props;
    let allData = data ? data : null;
    let value = event.target.value;
    let finalSearchedData = {}
    Object.keys(allData).filter(key => {
      if (key.toLowerCase().includes(value.toLowerCase())) {
        finalSearchedData[key] = allData[key]
      }
    })

    if (finalSearchedData) {
      this.setState({
        brandList: finalSearchedData,
        brandSearchKey: value
      })
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
    const { filter: { data } } = this.props;
    if (data) {
      return (
        <div block="MultiSelectOption">
          <ul block="selectedOptionLists">
            {Object.values(data).map(function (values, keys) {
              if (values.subcategories) {
                return Object.values(values.subcategories).map(function (val, key) {
                  if (val.is_selected === true) {
                    return (
                      <li key={key}>{val.label}, </li>
                    )
                  }
                })
              } else {
                if (values.is_selected === true) {
                  return (
                    <li key={keys}>{values.label}, </li>
                  )
                }
              }
            })}
          </ul>
        </div>
      )

    }

  }

  renderMultiselectContainer() {
    const { toggleOptionsList, isArabic } = this.state;
    const { placeholder, isHidden, filter } = this.props;

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
