// import { PureComponent } from 'react';
import { connect } from 'react-redux';

import AppConfigDispatcher from 'Store/AppConfig/AppConfig.dispatcher';

import MyAccountAddressForm from './MyAccountAddressForm.component';

export const mapStateToProps = (state) => ({
    countries: state.ConfigReducer.countries,
    default_country: state.ConfigReducer.default_country
});

export const mapDispatchToProps = (dispatch) => ({
    getCities: (locale) => AppConfigDispatcher.getCities(dispatch, locale)
});

// class MyAccountAddressFormContainer extends PureComponent {
//     render() {
//         console.log('------------------------------');
//         return (
//             <MyAccountAddressForm
//               { ...this.props }
//             />
//         );
//     }
// }

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountAddressForm);
