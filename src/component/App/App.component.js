import { Provider } from 'react-redux';

import Splash from 'Route/Splash';
import { App as SourceApp } from 'SourceComponent/App/App.component';
import configureStore from 'Store';
import AppConfig from 'Store/AppConfig/AppConfig.reducer';
import AppState from 'Store/AppState/AppState.reducer';
import Cart from 'Store/Cart/Cart.reducer';
import PDP from 'Store/PDP/PDP.reducer';
import PLP from 'Store/PLP/PLP.reducer';

class App extends SourceApp {
    rootComponents = [
        this.renderSplash.bind(this)
    ];

    getStore() {
        const store = configureStore();

        store.injectReducer('AppConfig', AppConfig);
        store.injectReducer('AppState', AppState);
        store.injectReducer('Cart', Cart);
        store.injectReducer('PLP', PLP);
        store.injectReducer('PDP', PDP);

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
