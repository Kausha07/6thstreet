import PropTypes from 'prop-types';
import { PureComponent } from 'react';

class GoogleTagManagerRouteWrapper extends PureComponent {
    static propTypes = {
        route: PropTypes.string,
        children: PropTypes.node.isRequired
    };

    static defaultProps = {
        route: ''
    };

    componentDidMount() {
        const { route } = this.props;

        window.currentRouteName = route;
        let prevScreen = "";
        const currentScreen = sessionStorage.getItem("currentScreen") || null;
        if (window.currentRouteName !== "url_rewrites") {
            prevScreen = currentScreen;
            sessionStorage.setItem("currentScreen", window.currentRouteName);
            sessionStorage.setItem("prevScreen", prevScreen);
        }
    }

    render() {
        const { children } = this.props;

        return children;
    }
}

export default GoogleTagManagerRouteWrapper;
