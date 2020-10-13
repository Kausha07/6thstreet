/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MyAccountDeliveryAddressForm from './MyAccountDeliveryAddressForm.component';

export const mapStateToProps = (state) => ({
    countries: state.ConfigReducer.countries,
    default_country: state.ConfigReducer.default_country
});

export class MyAccountDeliveryAddressFormContainer extends PureComponent {
    state = {
        cities: [{ areas: [] }]
    };

    async testFunct() {
        const { cities } = this.state;
        if (cities.length === 0) {
            const test = await fetch('https://mobileapi.6thstreet.com/v2/cities?locale=en-ae');
            const json = await test.json();
            this.setState({ cities: json.data });
        }
    }

    getCities = () => {
        this.testFunct();
        const { cities } = this.state;
        console.log(cities);
    };

    render() {
        return (
            <MyAccountDeliveryAddressForm
              { ...this.props }
              { ...this.state }
              getCities={ this.getCities }
            />
        );
    }
}

export default connect(mapStateToProps)(MyAccountDeliveryAddressFormContainer);
