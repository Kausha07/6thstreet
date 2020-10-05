// import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { MatchType } from 'Type/Common';
import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MyAccountReturnView from './MyAccountReturnView.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class MyAccountReturnViewContainer extends PureComponent {
    static propTypes = {
        match: MatchType.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    state = {
        isLoading: true,
        return: {}
    };

    constructor(props) {
        super(props);

        this.getReturn();
    }

    containerProps = () => {
        const {
            isLoading,
            return: returnItem
        } = this.state;

        return {
            isLoading,
            return: returnItem
        };
    };

    getReturnId() {
        const {
            match: {
                params: {
                    return: returnItem
                } = {}
            } = {}
        } = this.props;

        return returnItem;
    }

    async getReturn() {
        try {
            const returnId = this.getReturnId();
            const { data: returnItem } = await MagentoAPI.get(`/returns/${ returnId }`);

            this.setState({
                return: returnItem,
                isLoading: false
            });
        } catch (e) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <MyAccountReturnView
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountReturnViewContainer);
