import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import BrandGroup from 'Component/BrandGroup';
import Loader from 'Component/Loader';
import { FormattedBrands } from 'Util/API/endpoint/Brands/Brands.type';

import { KIDS_TYPE, MEN_TYPE, WOMEN_TYPE } from './Brands.config';

import './Brands.style';

class Brands extends PureComponent {
    static propTypes = {
        changeBrandType: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        brands: FormattedBrands.isRequired,
        type: PropTypes.string
    };

    static defaultProps = {
        type: null
    };

    onBrandCategoryClick = (categoryName) => () => {
        const { changeBrandType } = this.props;

        changeBrandType(categoryName);
    }

    renderCategorySelector() {
        const { type } = this.props;

        return (
            <div block="Brands" elem="Categories">
                <button
                  block="Brands"
                  elem="CategoryButton"
                  mods={ { isSelected: !type } }
                  onClick={ this.onBrandCategoryClick('') }
                >
                    { __('All') }
                </button>
                <button
                  block="Brands"
                  elem="CategoryButton"
                  mods={ { isSelected: type === WOMEN_TYPE } }
                  onClick={ this.onBrandCategoryClick(WOMEN_TYPE) }
                >
                    { __('Women') }
                </button>
                <button
                  block="Brands"
                  elem="CategoryButton"
                  mods={ { isSelected: type === MEN_TYPE } }
                  onClick={ this.onBrandCategoryClick(MEN_TYPE) }
                >
                    { __('Men') }
                </button>
                <button
                  block="Brands"
                  elem="CategoryButton"
                  mods={ { isSelected: type === KIDS_TYPE } }
                  onClick={ this.onBrandCategoryClick(KIDS_TYPE) }
                >
                    { __('Kids') }
                </button>
            </div>
        );
    }

    renderBrandGroup([letter, brands]) {
        return (
            <BrandGroup
              key={ letter }
              letter={ letter }
              brands={ brands }
            />
        );
    }

    renderBrandGroups() {
        const { brands } = this.props;
        return Object.entries(brands).map(this.renderBrandGroup);
    }

    render() {
        const { isLoading } = this.props;

        return (
            <div block="Brands">
                <Loader isLoading={ isLoading } />
                <h2 block="Brands" elem="Heading">{ __('Brands A-Z') }</h2>
                { this.renderCategorySelector() }
                <div block="Brands" elem="Groups">
                    { this.renderBrandGroups() }
                </div>
            </div>
        );
    }
}

export default Brands;
