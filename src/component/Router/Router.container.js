import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    RouterContainer as SourceRouterContainer,
    WishlistDispatcher
} from 'SourceComponent/Router/Router.container';
import { setCountry, setLanguage } from 'Store/AppState/AppState.action';
import { isSignedIn, setAuthorizationToken, setMobileAuthorizationToken } from 'Util/Auth';
import { getUrlParams } from 'Util/Url/Url';

export const MyAccountDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/MyAccount/MyAccount.dispatcher'
);

export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    locale: state.AppState.locale
});

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch),
    init: async () => {
        const { default: wishlistDisp } = await WishlistDispatcher;
        wishlistDisp.syncWishlist(dispatch);
    },
    setCountry: (value) => dispatch(setCountry(value)),
    setLanguage: (value) => dispatch(setLanguage(value)),
    requestCustomerData: () => MyAccountDispatcher
        .then(({ default: dispatcher }) => dispatcher.requestCustomerData(dispatch))
});

export class RouterContainer extends SourceRouterContainer {
    static propTypes = {
        ...SourceRouterContainer.propTypes,
        locale: PropTypes.string,
        requestCustomerData: PropTypes.func.isRequired
    };

    static defaultProps = {
        ...SourceRouterContainer.defaultProps,
        locale: ''
    };

    componentDidMount() {
        const { requestCustomerData } = this.props;
        const { search } = location;
        const decodedParams = atob(search.substr(1));

        if (isSignedIn()) {
            requestCustomerData();
        } else if (decodedParams.match('mobileToken') && decodedParams.match('authToken')) {
            const params = getUrlParams();
            const { mobileToken } = params;
            const { authToken } = params;

            setMobileAuthorizationToken(mobileToken);
            setAuthorizationToken(authToken);
            requestCustomerData().then(() => {
                window.location = '/';
            });
        }
    }

    containerProps = () => {
        const { isBigOffline, setCountry, setLanguage } = this.props;

        return {
            isBigOffline,
            isAppReady: this.getIsAppReady(),
            setCountry,
            setLanguage
        };
    };

    getIsAppReady() {
        const { locale } = this.props;

        return !!locale; // locale is '' => not ready
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterContainer);
