import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import AppConfigDispatcher from 'Store/AppConfig/AppConfig.dispatcher';
import MobileCartDispatcher from 'Store/MobileCart/MobileCart.dispatcher';
import { Config } from 'Util/API/endpoint/Config/Config.type';

import Splash from './Splash.component';

export const mapStateToProps = (state) => ({
    config: state.AppConfig.config
});

export const mapDispatchToProps = (dispatch) => ({
    getConfig: () => AppConfigDispatcher.getAppConfig(dispatch),
    getCart: () => MobileCartDispatcher.getCart(dispatch)
});

export class SplashContainer extends PureComponent {
    static propTypes = {
        getConfig: PropTypes.func.isRequired,
        getCart: PropTypes.func.isRequired,
        config: Config.isRequired
    };

    constructor(props) {
        super(props);

        this.requestConfig();
        this.getCart();
    }

    requestConfig() {
        const { getConfig } = this.props;
        getConfig();
    }

    getCart() {
        const { getCart } = this.props;
        getCart();
    }

    containerProps = () => ({
        isReady: this.getIsReady()
    });

    getIsReady() {
        const { config } = this.props;
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
