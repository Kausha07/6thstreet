import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Brand from 'Component/Brand';
import { Brands } from 'Util/API/endpoint/Brands/Brands.type';

import './BrandGroup.style';

class BrandGroup extends PureComponent {
    static propTypes = {
        letter: PropTypes.string.isRequired,
        isFiltered: PropTypes.bool,
        brands: Brands.isRequired
    };

    static defaultProps = {
        isFiltered: false
    };

    renderBrand(brand) {
        const { name } = brand;

        return (
            <Brand
              key={ name }
              brand={ brand }
            />
        );
    }

    renderBrands() {
        const { brands } = this.props;

        return brands.map(this.renderBrand);
    }

    render() {
        const { letter, isFiltered } = this.props;

        return (
            <div block="BrandGroup">
                { !isFiltered && (
                    <h4 block="BrandGroup" elem="Letter">{ letter }</h4>
                ) }
                <div block="BrandGroup" elem="Group" mods={ { isFiltered } }>
                    { this.renderBrands() }
                </div>
            </div>
        );
    }
}

export default BrandGroup;
