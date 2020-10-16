/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';

import PLPFilterOption from 'Component/PLPFilterOption';
import { Filter } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import './FieldMultiselect.style';

class FieldMultiselect extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        onChange: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        activeFilter: PropTypes.object,
        isChecked: PropTypes.bool,
        changeActiveFilter: PropTypes.func.isRequired,
        currentActiveFilter: PropTypes.string
    };

    static defaultProps = {
        placeholder: '',
        activeFilter: {},
        isChecked: false,
        currentActiveFilter: ''
    };

    filterButtonRef = createRef();

    constructor(props) {
        super(props);
        this.state = {
            toggleOptionsList: false,
            isArabic: isArabic(),
            subcategoryOptions: {}
        };
        this.toggelOptionList = this.toggelOptionList.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const { currentActiveFilter, filter } = props;
        const { toggleOptionsList, prevActiveFilter } = state;

        if (isMobile.any()) {
            return {
                toggleOptionsList: currentActiveFilter === filter.category
            };
        }

        console.log(!toggleOptionsList);

        if (currentActiveFilter === prevActiveFilter) {
            return {
                toggleOptionsList: !toggleOptionsList
            };
        }

        console.log('hereeeeeeeeeeeeee');

        return {
            toggleOptionsList: currentActiveFilter === filter.category,
            prevActiveFilter: currentActiveFilter
        };
    }

    renderSubcategoryOptions = (option) => {
        const { isArabic } = this.state;

        return (
            <div block="FieldMultiselect" elem="MobileOptionList" mods={ { isArabic } }>
                { Object.entries(option.subcategories).map(this.renderOption) }
            </div>
        );
    };

    handleSubcategoryClick = (option) => {
        const { subcategoryOptions } = this.state;
        const subcategoryOptionsValues = this.renderSubcategoryOptions(option);

        if (subcategoryOptions[option.label] === '' || subcategoryOptions[option.label] === undefined) {
            this.setState({
                subcategoryOptions: {
                    ...subcategoryOptions,
                    [option.label]: subcategoryOptionsValues
                }
            });
        } else {
            this.setState({
                subcategoryOptions: {
                    ...subcategoryOptions,
                    [option.label]: ''
                }
            });
        }
    };

    renderOptionMobile = (option) => {
        const { subcategoryOptions, isArabic } = this.state;

        return (
            <div block="FieldMultiselect" elem="MobileOptions">
                <button
                  block="FieldMultiselect"
                  elem="MobileOptionButton"
                  mods={ {
                      isClosed:
                    subcategoryOptions[option.label] === '' || subcategoryOptions[option.label] === undefined
                  } }
                  mix={ {
                      block: 'FieldMultiselect',
                      elem: 'MobileOptionButton',
                      mods: { isArabic }
                  } }
                  onClick={ () => this.handleSubcategoryClick(option) }
                >
                    { option.label }
                </button>
                { subcategoryOptions[option.label] }
            </div>
        );
    };

    renderOption = ([key, option]) => {
        const {
            filter: { is_radio },
            activeFilter,
            isChecked,
            onChange
        } = this.props;

        if (option.subcategories) {
            return !isMobile.any()
                ? Object.entries(option.subcategories).map(this.renderOption)
                : this.renderOptionMobile(option);
        }

        return (
            <PLPFilterOption
              key={ key }
              option={ option }
              isRadio={ is_radio }
              activeFilter={ activeFilter }
              isChecked={ isChecked }
              onChange={ onChange }
            />
        );
    };

    renderOptions() {
        const { filter: { data } } = this.props;

        return (
            <ul>
                { Object.entries(data).map(this.renderOption) }
            </ul>
        );
    }

    onCheckboxOptionClick = () => {
        this.filterButtonRef.current.focus();
    };

    handleFilterChange = () => {
        const { changeActiveFilter, filter } = this.props;
        changeActiveFilter(filter.category);
    };

    toggelOptionList() {
        const { currentActiveFilter } = this.props;
        const { toggleOptionsList, prevActiveFilter } = this.state;

        console.log(toggleOptionsList && currentActiveFilter === prevActiveFilter);

        if (toggleOptionsList && currentActiveFilter === prevActiveFilter) {
            this.setState({
                toggleOptionsList: !toggleOptionsList
            });
        } else {
            this.setState({
                toggleOptionsList
            });
        }

        this.handleFilterChange();
    }

    onBlur = () => {
        // eslint-disable-next-line no-magic-numbers
        setTimeout(this.toggelOptionList, 100);
    };

    renderMultiselectContainer() {
        const { toggleOptionsList, isArabic } = this.state;
        const { placeholder, onChange, filter: { is_radio } } = this.props;

        console.log(toggleOptionsList);

        return (
            <div block="FieldMultiselect">
            <button
              ref={ this.filterButtonRef }
              type="button"
              block="FieldMultiselect"
              elem="FilterButton"
              mods={ { toggleOptionsList } }
              mix={ {
                  block: 'FieldMultiselect',
                  elem: 'FilterButton',
                  mods: { isArabic }
              } }
              onClick={ isMobile.any() ? this.handleFilterChange : this.toggelOptionList }
            //   onFocus={ !isMobile.any() ? this.toggelOptionList : null }
            //   onBlur={ !isMobile.any() ? this.onBlur : null }
            >
                { placeholder }
            </button>
                <div
                  block="FieldMultiselect"
                  elem="OptionListContainer"
                  mods={ { toggleOptionsList } }
                  mix={ {
                      block: 'FieldMultiselect',
                      elem: 'OptionListContainer',
                      mods: { isArabic }
                  } }
                >
                <fieldset
                  block="PLPFilter"
                  onChange={ onChange }
                  onFocus={ !is_radio ? this.onCheckboxOptionClick : null }
                >
                        { this.renderOptions() }
                </fieldset>
                </div>
            </div>
        );
    }

    render() {
        return this.renderMultiselectContainer();
    }
}

export default FieldMultiselect;
