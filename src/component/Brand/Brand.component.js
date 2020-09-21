// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Brand as BrandType } from 'Util/API/endpoint/Brands/Brands.type';

import './Brand.style';

class Brand extends PureComponent {
    static propTypes = {
        brand: BrandType.isRequired
    };

    renderName() {
        const { brand: { name } } = this.props;

        return name;
    }

    renderCount() {
        const { brand: { count } } = this.props;

        return count;
    }

    render() {
        return (
            <div block="Brand">
                { this.renderName() }
                { this.renderCount() }
            </div>
        );
    }
}

export default Brand;
