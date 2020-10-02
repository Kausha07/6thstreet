import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    ConfigDispatcher,
    mapDispatchToProps as sourceMapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    RouterContainer as SourceRouterContainer
} from 'SourceComponent/Router/Router.container';

export {
    ConfigDispatcher
};

export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    locale: state.AppState.locale
});

export const mapDispatchToProps = (dispatch) => ({
    ...sourceMapDispatchToProps(dispatch)
    /* init: async () => {
        if (!isSignedIn()) {
            // ignore non-signed in
            return;
        }

        const { default: dispatcher } = await WishlistDispatcher;
        dispatcher.updateInitialWishlistData(dispatch);
    } */
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

    initializeApplication() {
        // implement init (disabled for now - 6th street has no endpoint)
    }

    containerProps = () => {
        const { isBigOffline } = this.props;

        return {
            isBigOffline,
            isAppReady: this.getIsAppReady()
        };
    };

    getIsAppReady() {
        const { locale } = this.props;
        return !!locale; // locale is '' => not ready
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterContainer);
