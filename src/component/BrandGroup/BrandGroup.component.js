import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Brand from 'Component/Brand';
import { Brands } from 'Util/API/endpoint/Brands/Brands.type';

import './BrandGroup.style';

class BrandGroup extends PureComponent {
    static propTypes = {
        letter: PropTypes.string.isRequired,
        brands: Brands.isRequired
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
        const { letter } = this.props;

        return (
            <div block="BrandGroup">
                <h4>{ letter }</h4>
                { this.renderBrands() }
            </div>
        );
    }
}

export default BrandGroup;
