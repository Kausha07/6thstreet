import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import AppConfigDispatcher from 'Store/AppConfig/AppConfig.dispatcher';
import CartDispatcher from 'Store/Cart/Cart.dispatcher';
import { Config } from 'Util/API/endpoint/Config/Config.type';

import Splash from './Splash.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config,
    locale: state.AppState.locale
});

export const mapDispatchToProps = (dispatch) => ({
    getConfig: () => AppConfigDispatcher.getAppConfig(dispatch),
    getCart: () => CartDispatcher.getCart(dispatch)
});

export class SplashContainer extends PureComponent {
    static propTypes = {
        getConfig: PropTypes.func.isRequired,
        getCart: PropTypes.func.isRequired,
        config: Config.isRequired,
        locale: PropTypes.string.isRequired
    };

    state = {
        isCartRetrieved: false
    };

    constructor(props) {
        super(props);

        this.requestConfig();
    }

    static getDerivedStateFromProps(props, state) {
        const { locale, getCart } = props;
        const { isCartRetrieved } = state;

        if (!isCartRetrieved && locale !== '') {
            getCart();

            return { isCartRetrieved: true };
        }

        return null;
    }

    requestConfig() {
        const { getConfig } = this.props;
        getConfig();
    }

    containerProps = () => ({
        isReady: this.getIsReady()
    });

    getIsReady() {
        const { config = {} } = this.props;
        // 0 keys in config => we are not ready
        return !!Object.keys(config).length;
    }

    render() {
        return (
            <Splash
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashContainer);
