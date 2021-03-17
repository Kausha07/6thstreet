import { connect } from 'react-redux';

import AppConfigDispatcher from 'Store/AppConfig/AppConfig.dispatcher';

import CheckoutAddressForm from './CheckoutAddressForm.component';

export const mapStateToProps = (state) => ({
    countries: state.ConfigReducer.countries,
    default_country: state.ConfigReducer.default_country
});

export const mapDispatchToProps = (dispatch) => ({
    getCities: (locale) => AppConfigDispatcher.getCities(dispatch, locale)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutAddressForm);
