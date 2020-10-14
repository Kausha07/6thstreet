import { PureComponent } from 'react';

import PLPFilterOption from 'Component/PLPFilterOption';
import { Slider } from 'SourceComponent/Slider/Slider.component';
import { Filter } from 'Util/API/endpoint/Product/Product.type';
import isMobile from 'Util/Mobile';

import './QuickCategoriesOptions.style';

class QuickCategoriesOptions extends PureComponent {
    static propTypes = {
        filter: Filter.isRequired
    };

    state = {
        activeSliderImage: 0,
        showFilterCount: 10
    };

    handleChange = (activeImage) => {
        this.setState({ activeSliderImage: activeImage });
    };

    renderOption = ([key, option]) => {
        if (option.subcategories) {
            return Object.entries(option.subcategories).map(this.renderOption);
        }

        return (
            <PLPFilterOption
              key={ key }
              option={ option }
            />
        );
    };

    concatSubCategories(values) {
        return values.reduce((acc, {
            subcategories
        }) => {
            acc.push({
                ...subcategories
            });

            return acc;
        }, []);
    }

    getSubCategoryList(values) {
        const categoryList = this.concatSubCategories(values);

        return categoryList.reduce((acc, item) => ({ ...acc, ...item }));
    }

    getSubcategories(data) {
        const haveSubcategories = 'subcategories' in Object.entries(data)[0][1];

        if (haveSubcategories) {
            const subCategories = Object.entries(data).map((entry) => entry[1]);
            return this.getSubCategoryList(subCategories);
        }

        return data;
    }

    prepareCategoryOptionsList() {
        const { showFilterCount } = this.state;
        const { filter: { data } } = this.props;

        const subCategoryList = this.getSubcategories(data);
        const sortedList = Object.entries(subCategoryList)
            .sort(([, a], [, b]) => b.product_count - a.product_count)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

        return Object.entries(sortedList).slice(0, showFilterCount).map((entry) => entry[1]);
    }

    renderOptions() {
        const Options = this.prepareCategoryOptionsList();

        return (
            <div
              block="QuickFilter"
              elem="List"
            >
                { Object.entries(Options).map(this.renderOption) }
            </div>
        );
    }

    renderMobileOptions() {
        const Options = this.prepareCategoryOptionsList();
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

    renderMultiSelectContainer() {
        return (
            <div
              block="FieldMultiselect"
            >
                <fieldset
                  block="PLPQuickFilter"
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
