import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { KIDS_GENDERS } from 'Route/Brands/Brands.config';
import { Brand as BrandType } from 'Util/API/endpoint/Brands/Brands.type';
import WebUrlParser from 'Util/API/helper/WebUrlParser';
import browserHistory from 'Util/History';

import './Brand.style';

class Brand extends PureComponent {
    static propTypes = {
        brand: BrandType.isRequired,
        type: PropTypes.string.isRequired
    };

    capitalizeFirstLetter(string = '') {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    renderName() {
        const { brand: { name } } = this.props;

        return name;
    }

    renderCount() {
        const { brand: { count } } = this.props;

        return count;
    }

    handleBrandRedirect = () => {
        const { brand: { name = '' }, type } = this.props;
        const urlName = name.replace('&', '')
            .replace(/(\s+)|--/g, '-')
            .replace('@', 'at')
            .toLowerCase();

        switch (type) {
        case 'women':
            browserHistory.push(`/${urlName}.html?q=${urlName}`);
            WebUrlParser.setParam('gender', this.capitalizeFirstLetter(type));
            break;
        case 'men':
            browserHistory.push(`/${urlName}.html?q=${urlName}`);
            WebUrlParser.setParam('gender', this.capitalizeFirstLetter(type));
            break;
        case 'kids':
            browserHistory.push(`/${urlName}.html?q=${urlName}`);
            WebUrlParser.setParam('gender', KIDS_GENDERS);
            break;
        default:
            browserHistory.push(`/${urlName}.html?q=${urlName}`);
        }
    };

    render() {
        return (
            <button onClick={ this.handleBrandRedirect } block="Brand">
                { this.renderName() }
            </button>
        );
    }
}

export default Brand;
