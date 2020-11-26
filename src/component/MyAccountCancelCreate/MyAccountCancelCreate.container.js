import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
    mapDispatchToProps,
    mapStateToProps,
    MyAccountReturnCreateContainer
} from 'Component/MyAccountReturnCreate/MyAccountReturnCreate.container';
import { HistoryType } from 'Type/Common';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountCancelCreate from './MyAccountCancelCreate.component';

export class MyAccountCancelCreateContainer extends MyAccountReturnCreateContainer {
    static propTypes = {
        history: HistoryType.isRequired,
        showErrorMessage: PropTypes.func.isRequired
    };

    state = {
        selectedItems: {},
        isLoading: false,
        incrementId: null,
        items: []
    };

    componentDidMount() {
        this._isMounted = true;

        this.getReturnableItems();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getReturnableItems() {
        const orderId = this.getOrderId();

        MagentoAPI.get(`order/${ orderId }/cancelable-items`).then(({ items, order_id }) => {
            if (!this._isMounted) {
                return;
            }

            this.setState({
                isLoading: false,
                items,
                incrementId: order_id,
                orderId
            });
        }).catch(() => {
            if (!this._isMounted) {
                return;
            }

            const { showErrorMessage } = this.props;

            this.setState({ isLoading: false });
            showErrorMessage(__('Something went wrong while fetching items'));
        });
    }

    onFormSubmit() {
        const { showErrorMessage, history } = this.props;
        const {
            selectedItems = {},
            items,
            incrementId,
            orderId
        } = this.state;
        const payload = {
            order_id: incrementId,
            items: Object.entries(selectedItems).map(([order_item_id, { reasonId }]) => {
                const { qty_to_cancel } = items.find(({ item_id }) => item_id === order_item_id) || {};

                return {
                    item_id: order_item_id,
                    qty: qty_to_cancel,
                    reason: reasonId
                };
            })
        };

        this.setState({ isLoading: true });

        MagentoAPI.post('recan/commitRecan', payload).then(() => {
            history.push(`/my-account/my-orders/${ orderId }`);
        }).catch(() => {
            showErrorMessage(__('Error appeared while requesting a cancelation'));
            this.setState({ isLoading: false });
        });
    }

    render() {
        return (
            <MyAccountCancelCreate
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountCancelCreateContainer));
