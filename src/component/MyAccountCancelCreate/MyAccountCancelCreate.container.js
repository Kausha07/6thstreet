import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { MyAccountReturnCreateContainer } from 'Component/MyAccountReturnCreate/MyAccountReturnCreate.container';
import { showNotification } from 'Store/Notification/Notification.action';
import { HistoryType } from 'Type/Common';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountCancelCreate from './MyAccountCancelCreate.component';

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
    showErrorNotification: (message) => dispatch(showNotification('error', message))
});

export class MyAccountCancelCreateContainer extends MyAccountReturnCreateContainer {
    static propTypes = {
        history: HistoryType.isRequired,
        showErrorNotification: PropTypes.func.isRequired
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

            this.setState({ isLoading: false, items, incrementId: order_id });
        }).catch(() => {
            if (!this._isMounted) {
                return;
            }

            const { showErrorNotification } = this.props;

            this.setState({ isLoading: false });
            showErrorNotification(__('Something went wrong while fetching items'));
        });
    }

    onFormSubmit() {
        const { showErrorNotification, history } = this.props;
        const { selectedItems, items, incrementId } = this.state;
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

        MagentoAPI.post('recan/commitRecan', payload).then(({ payload: { cancellation_id } }) => {
            history.push(`/my-account/return-item/cancel/success/${ cancellation_id }`);
        }).catch(() => {
            showErrorNotification(__('Error appeared while requesting a cancelation'));
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
