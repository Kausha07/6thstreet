import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';
import MyAccountReturnCreateListItem from 'Component/MyAccountReturnCreateListItem';
import { OrderType } from 'Type/API';

import './MyAccountReturnCreateList.style';

export class MyAccountReturnCreateList extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        orders: PropTypes.arrayOf(OrderType).isRequired
    };

    render() {
        const { orders, isLoading } = this.props;

        return (
            <div block="MyAccountReturnCreateList">
                <Loader isLoading={ isLoading } />
                { orders.map((order) => <MyAccountReturnCreateListItem order={ order } />) }
            </div>
        );
    }
}

export default MyAccountReturnCreateList;
