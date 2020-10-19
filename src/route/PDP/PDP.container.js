import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setPDPLoading } from 'Store/PDP/PDP.action';
import PDPDispatcher from 'Store/PDP/PDP.dispatcher';
import { Product } from 'Util/API/endpoint/Product/Product.type';

import PDP from './PDP.component';

export const mapStateToProps = (state) => ({
    isLoading: state.PDP.isLoading,
    product: state.PDP.product,
    options: state.PDP.options
});

export const mapDispatchToProps = (dispatch) => ({
    requestProduct: (options) => PDPDispatcher.requestProduct(options, dispatch),
    setIsLoading: (isLoading) => dispatch(setPDPLoading(isLoading))
});

export class PDPContainer extends PureComponent {
    static propTypes = {
        options: PropTypes.shape({ id: PropTypes.number }).isRequired,
        requestProduct: PropTypes.func.isRequired,
        setIsLoading: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        product: Product.isRequired,
        id: PropTypes.number.isRequired
    };

    containerFunctions = {
        // getData: this.getData.bind(this)
    };

    constructor(props) {
        super(props);

        this.requestProduct();
    }

    componentDidUpdate(prevProps) {
        const { id, isLoading, setIsLoading } = this.props;
        const currentIsLoading = this.getIsLoading();
        const { id: prevId } = prevProps;

        // Request product, if URL rewrite has changed
        if (id !== prevId) {
            this.requestProduct();
        }

        // Update loading from here, validate for last options recieved results from
        if (isLoading !== currentIsLoading) {
            setIsLoading(false);
        }
    }

    getIsLoading() {
        const {
            id,
            options: {
                id: requestedId
            }
        } = this.props;

        return id !== requestedId;
    }

    requestProduct() {
        const { requestProduct, id } = this.props;

        // ignore product request if there is no ID passed
        if (!id) {
            return;
        }

        requestProduct({ options: { id } });
    }

    containerProps = () => {
        // isDisabled: this._getIsDisabled()
    };

    render() {
        const { product } = this.props;
        localStorage.setItem('product', JSON.stringify(product.name));
        return (
            <PDP
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPContainer);
