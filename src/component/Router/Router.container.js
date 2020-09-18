import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    CartDispatcher,
    ConfigDispatcher,
    mapDispatchToProps,
    mapStateToProps as sourceMapStateToProps,
    RouterContainer as SourceRouterContainer,
    WishlistDispatcher
} from 'SourceComponent/Router/Router.container';

export {
    CartDispatcher,
    ConfigDispatcher,
    WishlistDispatcher,
    mapDispatchToProps
};

export const mapStateToProps = (state) => ({
    ...sourceMapStateToProps(state),
    locale: state.AppState.locale
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
