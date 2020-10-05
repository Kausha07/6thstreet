// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

import MyAccountReturnList from 'Component/MyAccountReturnList';
import MyAccountReturnView from 'Component/MyAccountReturnView';
import { withStoreRegex } from 'Component/Router/Router.component';

import './MyAccountReturns.style';

class MyAccountReturns extends PureComponent {
    static propTypes = {
        // TODO: implement prop-types
    };

    renderOrderList() {
        return <MyAccountReturnList />;
    }

    renderOrderView({ match }) {
        return (
            <MyAccountReturnView
              match={ match }
            />
        );
    }

    render() {
        return (
            <Switch>
                <Route
                  path={ withStoreRegex('/my-account/return-item') }
                  render={ this.renderOrderList }
                  exact
                />
                <Route
                  path={ withStoreRegex('/my-account/return-item/:return') }
                  render={ this.renderOrderView }
                  exact
                />
            </Switch>
        );
    }
}

export default MyAccountReturns;
