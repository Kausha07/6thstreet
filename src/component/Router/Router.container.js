import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    RouterContainer as SourceRouterContainer,
    WishlistDispatcher
} from 'SourceComponent/Router/Router.container';
import { setCountry, setLanguage } from 'Store/AppState/AppState.action';

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
    setLanguage: (value) => dispatch(setLanguage(value))
});

export class RouterContainer extends SourceRouterContainer {
    static propTypes = {
        ...SourceRouterContainer.propTypes,
        locale: PropTypes.string
    };

    static defaultProps = {
        ...SourceRouterContainer.defaultProps,
        locale: ''
    };

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
