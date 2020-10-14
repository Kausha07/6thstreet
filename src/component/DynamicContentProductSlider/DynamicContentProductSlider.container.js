import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import WebUrlParser from 'Util/API/helper/WebUrlParser';
import Algolia from 'Util/API/provider/Algolia';
import Logger from 'Util/Logger';

import DynamicContentProductSlider from './DynamicContentProductSlider.component';

export const mapStateToProps = (_state) => ({
    // wishlistItems: state.WishlistReducer.productsInWishlist
    language: _state.AppState.language
});

export const mapDispatchToProps = (_dispatch) => ({
    // addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class DynamicContentProductSliderContainer extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        data_url: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired
    };

    static defaultProps = {
        title: ''
    };

    state = {
        products: [],
        isLoading: true
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    constructor(props) {
        super(props);

        this.requestItems();
    }

    containerProps = () => {
        const {
            title,
            data_url,
            language
        } = this.props;

        const {
            products,
            isLoading
        } = this.state;

        return {
            title,
            data_url,
            language,
            isLoading,
            products
        };
    };

    async requestItems() {
        const { data_url } = this.props;

        const { params } = WebUrlParser.parsePLP(data_url);

        try {
            // request first 10 items from algolia
            const { data: products } = await new Algolia().getPLP({
                ...params,
                limit: 10
            });

            this.setState({
                products,
                isLoading: false
            });
        } catch (e) {
            // TODO: handle error
            Logger.log(e);

            this.setState({
                products: [],
                isLoading: false
            });
        }
    }

    render() {
        return (
            <DynamicContentProductSlider
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DynamicContentProductSliderContainer);
