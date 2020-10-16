import { PureComponent } from 'react';

import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountReturnCreateList from './MyAccountReturnCreateList.component';

export class MyAccountReturnCreateListContainer extends PureComponent {
    state = {
        isLoading: false,
        orders: []
    };

    componentDidMount() {
        this._isMonted = true;

        this.getOrderList();
    }

    componentWillUnmount() {
        this._isMonted = false;
    }

    containerProps = () => {
        const { orders, isLoading } = this.state;

        return { orders, isLoading };
    };

    getOrderList() {
        this.setState({ isLoading: true });

        MagentoAPI.get('orders/list').then(({ data: { orders } }) => {
            if (!this._isMonted) {
                return;
            }

            this.setState({ orders, isLoading: false });
        }).catch(() => {
            if (!this._isMonted) {
                return;
            }

            console.log('err)');
            this.setState({ isLoading: false });
        });
    }

    render() {
        return (
            <MyAccountReturnCreateList
              { ...this.containerProps() }
            />
        );
    }
}

export default MyAccountReturnCreateListContainer;
