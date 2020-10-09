/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

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

    constructor(props) {
        super(props);
        this.state = {
            toggleOptionsList: false,
            isArabic: isArabic(),
            subcategoryOptions: {}
            // isExpanded: false
        };
        this.toggelOptionList = this.toggelOptionList.bind(this);
    }

    static getDerivedStateFromProps(props) {
        if (isMobile.any()) {
            const { currentActiveFilter, filter } = props;

            return {
                toggleOptionsList: currentActiveFilter === filter.category
            };
        }

        return null;
    }

    renderOptionMobile = ([key, option]) => {
        // eslint-disable-next-line object-curly-newline
        const { filter: { is_radio }, activeFilter, isChecked, onChange } = this.props;

        if (option.subcategories) {
            return isMobile.any()
                ? Object.entries(option.subcategories).map(this.renderOptionMobile)
                : Object.entries(option.subcategories).map(this.renderOption);
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

    renderSubcategoryOptions = (option) => (
            <div block="FieldMultiselect" elem="MobileOptionList">
                { Object.entries(option.subcategories).map(this.renderOption) }
            </div>
    );

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
        const { subcategoryOptions } = this.state;

        return (
            <div block="FieldMultiselect" elem="MobileOptions">
                <button
                  block="FieldMultiselect"
                  elem="MobileOptionButton"
                  mods={ {
                      isClosed:
                    subcategoryOptions[option.label] === '' || subcategoryOptions[option.label] === undefined
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

    handleFilterChange = () => {
        const { changeActiveFilter, filter } = this.props;
        changeActiveFilter(filter.category);
    };

    toggelOptionList() {
        const { toggleOptionsList } = this.state;

        this.setState({
            toggleOptionsList: !toggleOptionsList
        });
    }

    onBlur = () => {
        // eslint-disable-next-line no-magic-numbers
        setTimeout(this.toggelOptionList, 100);
    };

    renderMultiselectContainer() {
        const { toggleOptionsList, isArabic } = this.state;
        const { placeholder, onChange } = this.props;

        return (
            <div block="FieldMultiselect">
            <button
              type="button"
              block="FieldMultiselect"
              elem="FilterButton"
              mods={ { toggleOptionsList } }
              mix={ {
                  block: 'FieldMultiselect',
                  elem: 'FilterButton',
                  mods: { isArabic }
              } }
              onClick={ isMobile.any() ? this.handleFilterChange : null }
              onFocus={ !isMobile.any() ? this.toggelOptionList : null }
              onBlur={ !isMobile.any() ? this.onBlur : null }
            >
                { placeholder }
            </button>
                <div
                  block="FieldMultiselect"
                  elem="OptionListContainer"
                  mods={ { toggleOptionsList } }
                >
                <fieldset
                  block="PLPFilter"
                  onChange={ onChange }
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
