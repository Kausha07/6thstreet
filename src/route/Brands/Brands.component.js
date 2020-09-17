// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import BrandGroup from 'Component/BrandGroup';
import { FormattedBrands } from 'Util/API/endpoint/Brands/Brands.type';

import './Brands.style';

class Brands extends PureComponent {
    static propTypes = {
        brands: FormattedBrands.isRequired
    };

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
        return (
            <div block="Brands">
                { this.renderBrandGroups() }
            </div>
        );
    }
}

export default Brands;
