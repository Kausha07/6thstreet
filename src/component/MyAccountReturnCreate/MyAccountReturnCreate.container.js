// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { HistoryType, MatchType } from 'Type/Common';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountReturnCreate from './MyAccountReturnCreate.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class MyAccountReturnCreateContainer extends PureComponent {
    static propTypes = {
        match: MatchType.isRequired,
        history: HistoryType.isRequired
    };

    containerFunctions = {
        onFormSubmit: this.onFormSubmit.bind(this),
        onItemClick: this.onItemClick.bind(this),
        onResolutionChange: this.onResolutionChange.bind(this),
        handleDiscardClick: this.onDiscardClick.bind(this)
    };

    state = {
        selectedItems: {},
        isLoading: true,
        incrementId: '',
        items: []
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
            selectedItems
        } = this.state;

        return {
            isLoading,
            incrementId,
            items,
            selectedNumber: Object.keys(selectedItems).length,
            history
        };
    };

    onDiscardClick() {
        const { history } = this.props;
        const { incrementId } = this.state;

        history.push(`/my-account/my-orders/${ incrementId }`);
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
        const orderId = this.getOrderId();

        this.setState({ isLoading: true });

        MagentoAPI.get(`orders/${ orderId }/returnable-items`).then(({ data: { items, order_id } }) => {
            this.setState({ items, incrementId: order_id, isLoading: false });
        }).catch((error) => {
            // TODO: Show error message
            console.error(error);
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
        this.setState(({ selectedItems }) => ({ selectedItems: { ...selectedItems, [itemId]: resolutionId } }));
    }

    onFormSubmit() {
        const { selectedItems } = this.state;
        const payload = {
            order_id: this.getOrderId(),
            items: Object.entries(selectedItems).map(([order_item_id, resolution]) => ({
                order_item_id,
                resolution: {
                    id: resolution
                }
            }))
        };

        this.setState({ isLoading: true });

        MagentoAPI.post('returns/request', payload).then(() => {
            this.setState({ isLoading: false });
            // TODO: Redirect to success page
        }).catch((error) => {
            // TODO: Change to show error message
            this.setState({ isLoading: false });
            console.error(error);
        });
    }

    render() {
        return (
            <MyAccountReturnCreate
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnCreateContainer));
