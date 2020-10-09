import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import MyAccountReturnCreateItem from './MyAccountReturnCreateItem.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class MyAccountReturnCreateItemContainer extends PureComponent {
    static propTypes = {
        item: PropTypes.shape({
            reason_options: PropTypes.array,
            item_id: PropTypes.string
        }).isRequired,
        onClick: PropTypes.func.isRequired,
        onResolutionChange: PropTypes.func.isRequired
    };

    state = {
        isSelected: false
    };

    containerFunctions = {
        onClick: this.onClick.bind(this),
        onResolutionChange: this.onResolutionChange.bind(this)
    };

    onResolutionChange(value) {
        const { onResolutionChange, item: { item_id } } = this.props;
        onResolutionChange(item_id, value);
    }

    onClick() {
        const { onClick, item: { item_id } } = this.props;

        this.setState(({ isSelected: prevIsSelected }) => {
            const isSelected = !prevIsSelected;
            onClick(item_id, isSelected);
            return { isSelected };
        });
    }

    containerProps = () => {
        const { item } = this.props;
        const { isSelected } = this.state;

        return {
            item,
            isSelected,
            resolutionOptions: this.getResolutionOptions()
        };
    };

    getResolutionOptions() {
        const { item: { reason_options } } = this.props;

        return reason_options.map(({ id, label }) => {
            const value = id.toString();
            return {
                id: value,
                label,
                value
            };
        });
    }

    render() {
        return (
            <MyAccountReturnCreateItem
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnCreateItemContainer);
