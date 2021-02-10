import { PropTypes } from 'prop-types';
import { PureComponent } from 'react';

import PLPQuickFilterOption from 'Component/PLPQuickFilterOption';
import { Slider } from 'SourceComponent/Slider/Slider.component';
import { Filter } from 'Util/API/endpoint/Product/Product.type';
import { isArabic } from 'Util/App';
import isMobile from 'Util/Mobile';

import { SUBCATEGORIES } from './QuickCategoriesOptions.config';

import './QuickCategoriesOptions.style';

class QuickCategoriesOptions extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired,
        updateFilters: PropTypes.func.isRequired,
        parentCallback: PropTypes.func.isRequired
    };

    state = {
        isArabic: isArabic(),
        activeSliderImage: 0,
        showFilterCountForEnglish: 10,
        showFilterCountForArabic: 8,
        showFilterCount: 0
    };

    componentDidMount() {
        const {
            showFilterCountForEnglish,
            showFilterCountForArabic,
            isArabic
        } = this.state;

        if (!isArabic) {
            this.setState({ showFilterCount: showFilterCountForEnglish });
        } else {
            this.setState({ showFilterCount: showFilterCountForArabic });
        }
    }

    handleChange = (activeImage) => {
        this.setState({ activeSliderImage: activeImage });
    };

    renderOption = ([key, option = {}]) => {
        const { updateFilters, parentCallback } = this.props;
        const { subcategories = {} } = option;

        if (Object.keys(subcategories).length !== 0) {
            return Object.entries(subcategories).map(this.renderOption);
        }

        return (
            <PLPQuickFilterOption
              key={ key }
              option={ option }
              updateFilters={ updateFilters }
              parentCallback={ parentCallback }
            />
        );
    };

    concatSubCategories(values = []) {
        return values.reduce((acc, {
            subcategories
        }) => {
            acc.push({
                ...subcategories
            });

            return acc;
        }, []);
    }

    prepareCategoryOptionsList() {
        const { showFilterCount } = this.state;
        const { filter: { data } } = this.props;

        const subCategoryList = this.getSubcategories(data) || {};
        const sortedList = Object.entries(subCategoryList)
            .sort(([, a], [, b]) => b.product_count - a.product_count)
            .reduce((acc,
                [k, v]) => {
                if (Object.keys(acc).length < showFilterCount) {
                    return { ...acc, [k]: v };
                }

                return acc;
            }, {});

        return Object.entries(sortedList).map((entry) => entry[1]);
    }

    getSubCategoryList(values) {
        const categoryList = this.concatSubCategories(values) || [];

        return categoryList.reduce((acc, item) => ({ ...acc, ...item }));
    }

    getSubcategories(data = {}) {
        if (Object.keys(data).length === 0) {
            return data;
        }
        const haveSubcategories = SUBCATEGORIES in Object.entries(data)[0][1];

        if (haveSubcategories) {
            const subCategories = Object.entries(data).map((entry) => entry[1]);
            return this.getSubCategoryList(subCategories);
        }

        return data;
    }

    renderOptions() {
        const { isArabic } = this.state;
        const Options = this.prepareCategoryOptionsList() || {};

        return (
            <div
              block="QuickFilter"
              elem="List"
              mods={ isArabic }
            >
                { Object.entries(Options).map(this.renderOption) }
            </div>
        );
    }

    renderMobileOptions() {
        const Options = this.prepareCategoryOptionsList() || {};
        const { activeSliderImage } = this.state;

        return (
            <Slider
              mix={ { block: 'QuickFilters', elem: 'MobileSlider' } }
              activeImage={ activeSliderImage }
              onActiveImageChange={ this.handleChange }
            >
                <div
                  block="QuickFilter"
                  elem="List"
                >
                    { Object.entries(Options).map(this.renderOption) }
                </div>
            </Slider>
        );
    }

    inSearch() {
        const { pathname } = window.location;
        return pathname === '/catalogsearch/result/';
    }

    renderMultiSelectContainer() {
        return (
            <div
              block="FieldMultiselect"
            >
                <fieldset
                  block="PLPQuickFilter"
                  mods={ { inSearch: this.inSearch() } }
                >
                    { isMobile.any() ? this.renderMobileOptions() : this.renderOptions() }
                </fieldset>
            </div>
        );
    }

    render() {
        return this.renderMultiSelectContainer();
    }
}

export default QuickCategoriesOptions;
