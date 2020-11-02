/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
/* eslint-disable func-names */
import { Provider } from 'react-redux';

import Splash from 'Route/Splash';
import { App as SourceApp } from 'SourceComponent/App/App.component';
import configureStore from 'Store';
import AppConfig from 'Store/AppConfig/AppConfig.reducer';
import AppState from 'Store/AppState/AppState.reducer';
import Cart from 'Store/Cart/Cart.reducer';
import PDP from 'Store/PDP/PDP.reducer';
import PLP from 'Store/PLP/PLP.reducer';
import SearchSuggestions from 'Store/SearchSuggestions/SearchSuggestions.reducer';

class App extends SourceApp {
    rootComponents = [
        this.renderSplash.bind(this)
    ];

    componentDidMount() {
        if (navigator.serviceWorker) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('service-worker.js').then(function (registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function (err) {
                    console.error('ServiceWorker registration failed: ', err);
                }).catch(function (err) {
                    console.error(err);
                });
            });
        }
    }

    getStore() {
        const store = configureStore();

        store.injectReducer('AppConfig', AppConfig);
        store.injectReducer('AppState', AppState);
        store.injectReducer('Cart', Cart);
        store.injectReducer('PLP', PLP);
        store.injectReducer('PDP', PDP);
        store.injectReducer('SearchSuggestions', SearchSuggestions);

        return store;
    }

    renderRedux(children) {
        return (
            <Provider store={ this.getStore() } key="redux">
                { children }
            </Provider>
        );
    }

    renderSplash() {
        return (
            <Splash key="splash" />
        );
    }
}

export default App;
