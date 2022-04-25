import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { showNotification } from 'Store/Notification/Notification.action';
import { HistoryType, MatchType } from 'Type/Common';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountReturnCreate from './MyAccountReturnCreate.component';

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
    showErrorMessage: (message) => dispatch(showNotification('error', message))
});

export class MyAccountReturnCreateContainer extends PureComponent {
    static propTypes = {
        match: MatchType.isRequired,
        history: HistoryType.isRequired,
        showErrorMessage: PropTypes.func.isRequired
    };

    containerFunctions = {
        onFormSubmit: this.onFormSubmit.bind(this),
        onItemClick: this.onItemClick.bind(this),
        onReasonChange: this.onReasonChange.bind(this),
        onResolutionChange: this.onResolutionChange.bind(this),
        handleDiscardClick: this.onDiscardClick.bind(this),
        onResolutionChangeValue: this.onResolutionChangeValue.bind(this)
    };

    state = {
        selectedItems: {},
        isLoading: true,
        incrementId: '',
        items: [],
        resolutionId: null,
        reasonId:0,
    };

    componentDidMount() {
        this.getReturnableItems();
    }

    containerProps = () => {
        const { history } = this.props;
        const {
            isLoading,
            incrementId,
            items,
            selectedItems = {},
            resolutions,
            resolutionId,
            reasonId
        } = this.state;

        return {
            isLoading,
            incrementId,
            items,
            selectedNumber: Object.keys(selectedItems).length,
            history,
            resolutions,
            resolutionId,
            reasonId
        };
    };
    onDiscardClick() {
        const { history } = this.props;
        const orderId = this.getOrderId();
        history.push(`/my-account/my-orders/${orderId}`);
    }

    getOrderId() {
        const {
            match: {
                params: {
                    order
                } = {}
            } = {}
        } = this.props;

        return order;
    }

    getReturnableItems() {
        const { showErrorMessage } = this.props;
        const orderId = this.getOrderId();

        this.setState({ isLoading: true });

        MagentoAPI.get(`orders/${orderId}/returnable-items`)
            .then(({ data: { items, order_increment_id, resolution_options } }) => {
                this.setState({
                    items,
                    incrementId: order_increment_id,
                    isLoading: false,
                    resolutions: resolution_options
                });
            }).catch(() => {
                showErrorMessage(__('Error appeared while fetching returnable items'));
                this.setState({ isLoading: false });
            });
    }

    onItemClick(itemId, isSelected) {
        this.setState(({ selectedItems }) => {
            if (!isSelected) {
                // eslint-disable-next-line no-unused-vars
                const { [itemId]: _, ...newSelectedItems } = selectedItems;
                return { selectedItems: newSelectedItems };
            }

            return { selectedItems: { ...selectedItems, [itemId]: false } };
        });
    }

    onResolutionChange(itemId, resolutionId) {
        const { selectedItems: { [itemId]: item }, } = this.state;

        this.setState(({ selectedItems }) => ({
            selectedItems: { ...selectedItems, [itemId]: { ...item, resolutionId } }
        }));
    }

    onReasonChange(itemId, reasonId) {
        const { selectedItems: { [itemId]: item } } = this.state;
        
        this.setState(({ selectedItems }) => ({
            selectedItems: { ...selectedItems, [itemId]: { ...item, reasonId } }
        }));

        this.setState({reasonId: reasonId})

        this.onResolutionChangeValue({resolutionId:false});
    }
    onResolutionChangeValue(value) {
        this.setState({ resolutionId: value })
    }
    onFormSubmit() {
        const { history, showErrorMessage } = this.props;
        const { selectedItems = {}, items, resolutionId } = this.state;
        const payload = {
            order_id: this.getOrderId(),
            items: Object.entries(selectedItems).map(([order_item_id, { reasonId, resolutionIdd }]) => {
                const {
                    qty_shipped = 0
                } = items.find(({ item_id }) => item_id === order_item_id) || {};

                return {
                    order_item_id,
                    qty_requested: qty_shipped,
                    resolution: {
                        id: resolutionId,
                        data: null
                    },
                    reason: {
                        id: reasonId,
                        data: null
                    }
                };
            })
        };
        this.setState({ isLoading: true });

        MagentoAPI.post('returns/request', payload).then(({ data: { id } }) => {
            history.push(`/my-account/return-item/create/success/${id}`);
        }).catch(() => {
            showErrorMessage(__('Error appeared while requesting a return'));
            this.setState({ isLoading: false });
        });
    }

    render() {
        return (
            <MyAccountReturnCreate
                {...this.containerFunctions}
                {...this.containerProps()}
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnCreateContainer));
